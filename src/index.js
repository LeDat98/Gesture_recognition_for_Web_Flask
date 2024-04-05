// Nhập các thư viện cần thiết từ @mediapipe/tasks-vision
import { GestureRecognizer, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

// Lấy phần tử HTML để hiển thị các demo
const demosSection = document.getElementById("demos");
// Khởi tạo biến cho nhận dạng cử chỉ
let gestureRecognizer;
// Đặt chế độ hoạt động mặc định là ảnh
let runningMode = "IMAGE";
let enableWebcamButton;
let webcamRunning = false;
// Đặt kích thước cho video
const videoHeight = "360px";
const videoWidth = "480px";

// Hàm tạo nhận dạng cử chỉ, cần đợi nó tải xong trước khi sử dụng
// vì các mô hình Machine Learning có thể lớn và mất thời gian để tải
const createGestureRecognizer = async () => {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: "/static/fingermath_gesture_recognizer.task",
            delegate: "GPU"
        },
        runningMode: runningMode
    });
    demosSection.classList.remove("invisible");
};
createGestureRecognizer();

// Lấy các phần tử HTML để xử lý video và hiển thị kết quả
const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const gestureOutput = document.getElementById("gesture_output");

// Hàm kiểm tra xem trình duyệt có hỗ trợ truy cập webcam không
function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// Nếu hỗ trợ webcam, thêm sự kiện cho nút kích hoạt webcam
if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("webcamButton");
    enableWebcamButton.addEventListener("click", enableCam);
}
else {
    console.warn("getUserMedia() is not supported by your browser");
}

// Hàm kích hoạt xem trực tiếp qua webcam và bắt đầu phát hiện
function enableCam(event) {
    if (!gestureRecognizer) {
        alert("Please wait for gestureRecognizer to load");
        return;
    }
    if (webcamRunning === true) {
        webcamRunning = false;
        enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    }
    else {
        webcamRunning = true;
        enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }
    // Tham số cho getUserMedia
    const constraints = {
        video: { facingMode: "environment" } // Sử dụng camera sau
    };
    // Kích hoạt dòng video từ webcam
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
    });
}

// Hàm dự đoán cử chỉ từ video webcam
let lastVideoTime = -1;
let results = undefined;
async function predictWebcam() {
    // Bắt đầu phát hiện trong luồng video
    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
    }
    let nowInMs = Date.now();
    if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        results = gestureRecognizer.recognizeForVideo(video, nowInMs);
    }
    // Vẽ kết quả lên canvas
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    const drawingUtils = new DrawingUtils(canvasCtx);
    canvasElement.style.height = videoHeight;
    video.style.height = videoHeight;
    canvasElement.style.width = videoWidth;
    video.style.width = videoWidth;
    if (results && results.landmarks) {
        for (const landmarks of results.landmarks) {
            drawingUtils.drawConnectors(landmarks, GestureRecognizer.HAND_CONNECTIONS, {
                color: "#00FF00",
                lineWidth: 5
            });
            drawingUtils.drawLandmarks(landmarks, {
                color: "#FF0000",
                lineWidth: 2
            });
        }
    }
    canvasCtx.restore();
    // Hiển thị thông tin cử chỉ nếu có
    if (results && results.gestures.length > 0) {
        gestureOutput.style.display = "block";
        gestureOutput.style.width = videoWidth;
        const categoryName = results.gestures[0][0].categoryName;
        const categoryScore = parseFloat(results.gestures[0][0].score * 100).toFixed(2);
        const handedness = results.handednesses[0][0].displayName;
        gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`;
    }
    else {
        gestureOutput.style.display = "none";
    }
    // Tiếp tục gọi hàm này để duy trì việc dự đoán khi trình duyệt sẵn sàng
    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }
}

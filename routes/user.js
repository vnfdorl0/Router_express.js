// express 모듈 불러오기
const express = require('express');
// express의 Router함수 호출 -> 새로운 Router 객체 생성
const router = express.Router();

// GET 라우터 -> HTTP GET 요청 처리
router.get('/', (req, res) => {
    res.send('Hello, User');
    // 클라이언트에게 문자열 전송
});
    // router.get(라우터의 경로, (요청 객체, 응답 객체)

// 라우터를 모듈로 내보냄
module.exports = router;
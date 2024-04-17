// express 모듈 불러오기
const express = require('express');
// express의 Router함수 호출 -> 새로운 Router 객체 생성
const router = express.Router();

// GET 라우터 -> HTTP GET 요청 처리
router.get('/', (req, res, next) => {
    // router.get(라우터의 경로, (요청 객체, 응답 객체)
    res.render('index', { title: 'Express' });
    // res.render() 함수 -> 뷰 템플릿을 렌더링
    // 'index' -> 렌더링할 템플릿 파일 이름
    // { title: 'Wxpress' } -> 템플릿에 전달되는 데이터, 'title' 변수에 'Express' 값 전달
});

// 라우터를 모듈로 내보냄
module.exports = router;
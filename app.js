// express 모듈
const express = require('express');
// morgan 미들웨어 -> HTTP 요청 로그 기록
const morgan = require('morgan');
// cookit-parser 미들웨어 -> 쿠키를 파싱
const cookieParser = require('cookie-parser');
// express-session 미들웨어 -> 세션을 구현
const session = require('express-session');
// dotenv 라이브러리 -> 환경 변수 관리
const dotenv = require('dotenv');
// path 모듈 -> 파일 경로 관리
const path = require('path');
// nunjucks 모듈 -> Nunjucks 템플릿 엔진 사용
const nunjucks = require('nunjucks');


dotenv.config(); // dotenv 설정파일 불러오기

// 라우터 모듈 불러오기
const indexRouter = require('./routes');
const userRouter = require('./routes/user');

// express 애플리케이션 생성
const app = express();
// 포트 설정
app.set('port', process.env.PORT || 3000);
    // 환경 변수에 PORT가 설정되어 있지 않으면 3000번 포트를 사용
app.set('view engine', 'html');
    // Express 애플리케이션에서 사용할 뷰 엔진을 설정

// Nunjucks 템플릿 엔진을 설정
nunjucks.configure('views', {
    // 'views' -> 템플릿 파일이 위치한 디렉로리 경로 지정
    express: app,
    // Nunjucks가 Express의 템플릿 엔진으로 사용될 때, Express 애플리케이션과 연동될 수 있도록 설정
    watch: true,
    // 템플릿 파일의 변경 -> Nunjucks 자동업데이트 수행
    // 템플릿 파일이 변경되면 변겅사항을 서버 재시작 없이 반영
});

// morgan 미들웨어 -> 개발 환경에서 요청 로그 출력
app.use(morgan('dev'));
// express.static 미들웨어 -> 정적 파일 제공
app.use('/', express.static(path.join(__dirname, 'public')));
// express.json 미들웨어 -> JSON 형석의 요청 본문 파싱
app.use(express.json());
// express.urlencoded 미들웨어 -> URL-encoded 형식의 요청 본문 파싱
app.use(express.urlencoded({ extended: false }));
// cookieParser 미들웨어 -> 쿠키를 파싱
app.use(cookieParser(process.env.COOKIE_SECRET));

// 세션을 등록하기 위한 미들웨어 등록
app.use(session({
    resave: false,
    // 변경 사항이 없을 경우에도 세션을 다시 저장하지 않음.
    saveUninitialized: false,
    // 초기화되지 않은 세션은 저장되지 않음.
    secret: process.env.COOKIE_SECRET,
    // 세션을 암호화하기 위한 시크릿 키
    cookie: {
        httpOnly: true,
        // 클라이언트에서 쿠키를 수정할 수 없도록 설정
        secure: false,
        // HTTPS가 아닌 환경에서도 쿠키를 사용할 수 있도록 설정
    },
    name: 'session-cookie',
    // 세션 쿠키의 이름 지정
}));

// '/' 경로에 대한 라우터 등록
app.use('/', indexRouter);
// '/user' 경로에 대한 라우터 등록
app.use('/user', userRouter);

// 위에서 등록된 라우터에 일치하는 경로가 없는 경우
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`)
    // 새로운 에러 객체를 생성 -> 에러 메시지로 현재 요청의 메서드와 URL을 설정
    error.status = 404;
    // 에러 객체의 상태 코드를 404로 설정
    next(error);
    // 다음 미들웨어에게 에러를 전달
});

// 에러 핸들링 미들웨어 -> 에러가 발생하는 경우 실행
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    // 에러 메시지를 로컬 변수에 할당
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    // process.env.NODE_ENV -> 현재 실행 환경을 나타내는 Node.js의 환경 변수
    // 에러 객체를 'production'(배표) 환경이 아닌 경우(개발환경 또는 테스트 환경)에만 로컬 변수에 할당
    // 'production'(배표) 환경에서는 빈 객체 할당 -> 보안 및 개인정보 강화(error.html의 error.stack 노출 차단)
    res.status(err.status || 500);
    // 응답 상태 코드를 에러 객체의 상태 코드 또는 500으로 설정
    res.render('error');
    // 'error' 템플릿을 렌더링하여 에러 페이지를 표시
});

// 지정된 포트에서 서버 대기
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
    // 서버가 대기중임을 콘솔에 출력
});
const Timetable = require('comcigan-parser');
const timetable = new Timetable();

export default async function handler(req, res) {
  // 위젯에서 보낸 학교명과 선생님 이름 받기 (예: ?school=서울고&teacher=홍길동)
  const { school, teacher } = req.query;

  if (!school || !teacher) {
    return res.status(400).json({ error: "학교명과 선생님 이름을 입력해주세요." });
  }

  try {
    // 1. 컴시간 시스템 초기화 및 학교 검색
    await timetable.init();
    const schoolList = await timetable.search(school);
    
    if (schoolList.length === 0) {
      return res.status(404).json({ error: "학교를 찾을 수 없습니다." });
    }

    // 2. 검색된 첫 번째 학교로 설정
    const targetSchool = schoolList[0];
    await timetable.setSchool(targetSchool.schoolCode);

    // 3. 전교생/전체 교사 시간표 데이터 가져오기
    const allData = await timetable.getTimetable();

    // 4. 전체 데이터에서 특정 선생님의 시간표만 골라내기 (데이터 가공)
    // (참고: comcigan-parser는 보통 학급별 시간표를 반환하므로, 
    // 전체 학급을 순회하며 요청한 'teacher'와 일치하는 수업만 뽑아내는 로직이 필요합니다.)
    let teacherSchedule = extractTeacherSchedule(allData, teacher);

    // 5. 위젯이 이해할 수 있는 깔끔한 JSON으로 응답
    res.status(200).json(teacherSchedule);

  } catch (error) {
    res.status(500).json({ error: "시간표를 가져오는 중 오류가 발생했습니다." });
  }
}

// 선생님 시간표를 뽑아내는 가상의 헬퍼 함수
function extractTeacherSchedule(allData, targetTeacher) {
  // 월~금(5일), 1~6교시(6칸) 빈 배열 생성
  let schedule = Array.from({ length: 5 }, () => Array(6).fill({ subject: "", isChanged: false }));
  
  // 실제로는 allData를 반복문으로 돌면서 targetTeacher의 수업을 schedule 배열에 채워 넣는 코드가 들어갑니다.
  // (학교마다 컴시간 데이터 구조가 조금씩 다를 수 있어 구조 확인 후 파싱 로직 세분화 필요)
  
  return schedule;
}

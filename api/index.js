const Timetable = require('comcigan-parser');
const timetable = new Timetable();

export default async function handler(req, res) {
  const { school, teacher } = req.query;

  // 1. 파라미터 확인
  if (!school || !teacher) {
    return res.status(400).json({ error: "주소창 끝에 ?school=학교명&teacher=이름 을 붙여주세요." });
  }

  try {
    // 2. 컴시간 파서 초기화 및 학교 검색
    await timetable.init();
    const schoolList = await timetable.search(school);
    
    if (schoolList.length === 0) {
      return res.status(404).json({ error: `'${school}' 학교를 컴시간에서 찾을 수 없습니다. 이름을 확인해주세요.` });
    }

    // 3. 학교 설정 및 데이터 가져오기
    const targetSchool = schoolList[0];
    await timetable.setSchool(targetSchool.schoolCode);
    const allData = await timetable.getTimetable();

    // 4. 성공 시: 컴시간에서 가져온 전체 데이터를 그대로 화면에 뿌려봅니다.
    return res.status(200).json({
      message: "컴시간 연동 대성공!",
      schoolInfo: targetSchool,
      data: allData
    });

  } catch (error) {
    // 🚨 실패 시: 에러가 발생한 '진짜 이유'를 화면에 출력합니다.
    return res.status(500).json({ 
      error: "컴시간 파싱 실패", 
      detail: error.message 
    });
  }
}

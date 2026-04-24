# 전도폭발 암기 앱

전도폭발 1단계 복음제시 암기·시험대비 모바일 웹앱입니다.

## 기능

- **복음전체 암기**: 전체 복음제시 원문 한 줄씩 학습
- **시험준비 (개요 #6)**: 복음제시 개요 #6 암기
- **제목만 보고 말하기**: 섹션 제목만 보고 내용을 직접 말해보는 모드
- **빈칸 테스트**: 키워드 빈칸 채우기 (쉬움/보통/어려움)
- **진도 보기**: 파트별 진행률 확인
- **헷갈린 부분 복습**: 헷갈림 표시한 항목만 모아서 복습

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 배포 (Vercel)

```bash
# Vercel CLI 사용
npx vercel

# 또는 GitHub 연동 후 자동 배포
```

## 데이터 수정

`/data/contents.ts` 파일에서 텍스트 데이터를 직접 수정할 수 있습니다.

- `outline6`: 복음제시 개요 #6 (실데이터)
- `fullGospel`: 전체 복음제시 (현재 샘플, 실제 원문으로 교체 예정)

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- localStorage (진도 저장)
- Vercel (배포)

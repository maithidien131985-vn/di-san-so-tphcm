import React, { useState, useEffect } from 'react';

const phrases = [
  "Chứng nhân lịch sử của ngày 30–4–1975",
  "Kiệt tác kiến trúc & Phong thủy phương Đông",
  "Khảo sát hồ sơ tư liệu & Hiện vật số tương tác",
  "Giáo dục truyền thống yêu nước & Lịch sử TP.HCM",
  "Hành trình khám phá Di sản số Việt Nam"
];

export default function TypewriterText() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(70);

  useEffect(() => {
    const fullText = phrases[currentPhraseIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        setCurrentText(fullText.slice(0, currentText.length + 1));
        setTypingSpeed(60 + Math.random() * 30);

        if (currentText === fullText) {
          // Finished typing word, pause before delete
          setTimeout(() => setIsDeleting(true), 2200);
        }
      } else {
        // Deleting
        setCurrentText(fullText.slice(0, currentText.length - 1));
        setTypingSpeed(35);

        if (currentText === '') {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex, typingSpeed]);

  return (
    <div className="inline-flex items-center min-h-[1.75rem] text-xs sm:text-sm font-semibold text-amber-200">
      <span>{currentText}</span>
      <span className="typewriter-cursor" />
    </div>
  );
}

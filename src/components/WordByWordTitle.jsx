import React from 'react';
import { motion } from 'framer-motion';

/**
 * Hiệu ứng hiện tiêu đề từng từ một (Word-by-word animated text reveal)
 * Tương thích tốt với mọi thiết bị, hỗ trợ tự động xuống dòng và giữ nguyên kiểu chữ
 */
export default function WordByWordTitle({
  text,
  children,
  as: Component = 'h1',
  className = '',
  staggerDelay = 0.05,
  initialDelay = 0.1,
  duration = 0.45,
  once = true,
  style = {}
}) {
  const content = text || (typeof children === 'string' ? children : '');

  // Nếu children là JSX phức tạp không phải string thuần
  if (!content && children) {
    return <Component className={className} style={style}>{children}</Component>;
  }

  // Tách văn bản thành các từ riêng biệt
  const words = content.trim().split(/\s+/).filter(Boolean);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (customInitialDelay = initialDelay) => ({
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: customInitialDelay
      }
    })
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 14,
      filter: 'blur(3px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: duration,
        ease: [0.22, 1, 0.36, 1] // cubic-bezier cho chuyển động tự nhiên
      }
    }
  };

  const MotionComponent = motion[Component] || motion.h1;

  return (
    <MotionComponent
      key={content} // Re-animate mượt mà khi nội dung tiêu đề thay đổi
      className={`${className} inline-flex flex-wrap items-center`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-40px' }}
      style={style}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={wordVariants}
          className="inline-block mr-[0.26em] last:mr-0 will-change-transform"
        >
          {word}
        </motion.span>
      ))}
    </MotionComponent>
  );
}

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Lấy giá trị ban đầu từ localStorage
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Theo dõi sát sao biến isDark để ép class vào thẻ html gốc
  useEffect(() => {
    const root = window.document.documentElement;
    console.log("Trạng thái isDark hiện tại:", isDark); // <-- Log kiểm tra dòng 1

    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      console.log("Đã THÊM class dark vào thẻ html:", root.classList.toString()); // <-- Log kiểm tra dòng 2
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      console.log("Đã XÓA class dark khỏi thẻ html:", root.classList.toString()); // <-- Log kiểm tra dòng 3
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev); // Sử dụng callback (prev) => !prev để đảm bảo không bị cache trạng thái cũ
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
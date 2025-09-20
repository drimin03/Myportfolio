// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      translate: {
        '101': '101%',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0%)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 15s linear infinite',
      },
    },
    screens: {
      xs: "480px", // custom breakpoint for small mobile screens
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      xxl:"1390px"
    }
  },
  plugins: [],
  
};

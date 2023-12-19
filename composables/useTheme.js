export default function useTheme() {
    const theme = ref('system');
  
    const setThemeClass = (value) => {
      localStorage.setItem('theme', value);
      theme.value = value;
      if (value === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (value === 'system') {
        getUserPreference() === 'dark'
          ? document.documentElement.classList.add('dark')
          : document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

    };
  
    const getUserPreference = () => {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    };

    const getPreference = () => {
      return localStorage.getItem('theme') || getUserPreference();
    }
  
    const toggleTheme = () => {
      theme.value = theme.value === 'light' ? 'dark' : 'light';
      setThemeClass(theme.value);

    };
  
    onMounted(() => {
      const savedTheme = localStorage.getItem('theme') || getUserPreference();
      theme.value = savedTheme;
      setThemeClass(savedTheme);
    });
  
    return { theme, toggleTheme, getPreference, setThemeClass };
  }
  
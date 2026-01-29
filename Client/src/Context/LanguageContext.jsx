import { setLanguage } from "@/features/theme/themeSlice";
import { createContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";

export const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState("en");
  const [translations, setTranslations] = useState({});

  const dispatch = useDispatch();


  useEffect(()=>{
     dispatch(setLanguage(language));
  },[language,dispatch])


  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        console.log("Fetching translations for:", language); // ✅ Check korar jonno
        const response = await fetch(`/locales/${language}.json`);
        const data = await response.json();
        console.log("Fetched Data:", data); // ✅ Check korar jonno
        setTranslations(data);
      } catch (error) {
        console.error("Error loading translation:", error);
      }
    };

    if (language) {
      fetchTranslations(); // ✅ `language` set হওয়ার পর `fetch` কল করবো
    }
  }, [language]); // ✅ `language` পরিবর্তন হলেই নতুন `fetch` কল হবে

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLanguageState, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;

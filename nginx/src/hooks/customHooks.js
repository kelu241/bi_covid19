import { useState, useEffect, useCallback, useRef } from 'react';

// ===== 1. Hook customizado para LocalStorage =====
export const useLocalStorage = (key, initialValue) => {
  // Função para obter valor inicial
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      
      // Tentar JSON.parse, mas se falhar, retornar string diretamente
      try {
        return JSON.parse(item);
      } catch (parseError) {
        // Se não for JSON válido, provavelmente é uma string simples (como token)
        console.log(`localStorage "${key}" não é JSON, usando como string`);
        return item;
      }
    } catch (error) {
      console.error(`Erro ao ler localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Função para salvar no localStorage
  const setValue = useCallback((value) => {
    try {
      // Permite que value seja uma função (como setState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Se for string simples, salvar direto. Se for objeto/array, usar JSON.stringify
      if (typeof valueToStore === 'string') {
        window.localStorage.setItem(key, valueToStore);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Erro ao salvar localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

// ===== 2. Hook customizado para buscar dados =====
export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, fetchData]);

  // Retorna dados e função para recarregar
  return { data, loading, error, refetch: fetchData };
};

// ===== 3. Hook customizado para contador =====
export const useCounter = (initialValue = 0, step = 1) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => prev + step);
  }, [step]);

  const decrement = useCallback(() => {
    setCount(prev => prev - step);
  }, [step]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const setValue = useCallback((value) => {
    setCount(value);
  }, []);

  return {
    count,
    increment,
    decrement,
    reset,
    setValue
  };
};

// ===== 4. Hook customizado para toggle =====
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue
  };
};

// ===== 5. Hook customizado para debounce =====
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// ===== 6. Hook customizado para interval =====
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Lembra da última callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Configura o interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

// ===== 7. Hook customizado para dimensões da janela =====
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Chama imediatamente para pegar o tamanho inicial

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// ===== 8. Hook customizado para validação de formulário =====
export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validateField = useCallback((name, value) => {
    const rule = validationRules[name];
    if (!rule) return null;

    if (rule.required && !value) {
      return rule.message || `${name} é obrigatório`;
    }

    if (rule.minLength && value.length < rule.minLength) {
      return `${name} deve ter pelo menos ${rule.minLength} caracteres`;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || `${name} está em formato inválido`;
    }

    return null;
  }, [validationRules]);

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);

  const validateAll = useCallback(() => {
    const newErrors = {};
    Object.keys(values).forEach(key => {
      const error = validateField(key, values[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setIsValid(valid);
    return valid;
  }, [values, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsValid(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isValid,
    setValue,
    validateAll,
    reset
  };
};

export const useLimparLocalStorage = (key) => {
  const limpar = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Erro ao limpar localStorage key "${key}":`, error);
    }
  }, [key]);

  return limpar;
}

export const validateGoogleBusinessId = (id) => {
  if (!id) return { isValid: false, error: 'O ID não pode estar vazio.' };
  const strId = String(id);
  const trimmed = strId.trim();
  if (trimmed.length < 5) return { isValid: false, error: 'O ID do Google Business deve ter pelo menos 5 caracteres.' };
  return { isValid: true, error: null, value: trimmed };
};

export const validateWhatsAppNumber = (number) => {
  if (!number) return { isValid: false, error: 'O número não pode estar vazio.' };
  const strNum = String(number);
  const cleanNum = strNum.replace(/[\s-]/g, '');
  const phoneRegex = /^\+?[0-9]{9,15}$/;
  if (!phoneRegex.test(cleanNum)) {
    return { isValid: false, error: 'Formato inválido. Use um número válido, ex: +351912345678.' };
  }
  return { isValid: true, error: null, value: cleanNum };
};

export const validateBookingLink = (url) => {
  if (!url) return { isValid: false, error: 'O link não pode estar vazio.' };
  
  const strUrl = String(url).trim();
  
  if (!/^https?:\/\//i.test(strUrl)) {
    return { isValid: false, error: 'O link deve começar com http:// ou https://' };
  }
  
  try {
    new URL(strUrl);
    return { 
      isValid: true, 
      error: null, 
      value: strUrl 
    };
  } catch (e) {
    return { isValid: false, error: 'Formato de URL inválido.' };
  }
};

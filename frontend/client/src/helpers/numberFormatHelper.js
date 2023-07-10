const formatNumberWithCommas = (number, language) => {
    const englishNumberFormat = new Intl.NumberFormat('en-US');
    const arabicNumberFormat = new Intl.NumberFormat('ar-EG');
  
    if (language.toLowerCase() === 'en') {
      return englishNumberFormat.format(number);
    } else if (language.toLowerCase() === 'ar') {
      return arabicNumberFormat.format(number);
    } else {
      return 'Invalid language. Please provide either "English" or "Arabic".';
    }
}

export {formatNumberWithCommas}
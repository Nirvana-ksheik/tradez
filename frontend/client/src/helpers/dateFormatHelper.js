import moment from 'moment';
import 'moment/locale/ar';

const formatDateWithLanguage = (date, language) => {
    const format = language === "en" ? "y MMM DD - hh:mm" : "y MMM DD الساعة  hh:mm"
    console.log("date: ", date);
    console.log("language: ", language)
    var publishedDate = new Date(date);
    moment.updateLocale(language, {
        // Arabic locale options here
    });    
    var formattedDate = moment(publishedDate).locale(language).format(format);
    return formattedDate;
}

export {formatDateWithLanguage}
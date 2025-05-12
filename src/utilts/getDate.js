/**
 * @typedef {Object} DateFormatOptions
 * @property {String} format - YYYY - год, MM - номер месяца, FMM - название месяца, DD - день, HH - часы, mm - минуты, ss - секунды
 * @property {Number} unix - Передать время
 * @property {'full' | 'numbers' | 'logger' | 'custom' | 'json'} type - тип вывода, если custom - заполнить format
 * @property {Boolean} utc - Можно забить
 * @property {Boolean} zero - получить 00:00:00 этой даты
 */

/**
 * @param {DateFormatOptions} [options={ type: 'full' }] Параметры
 * @returns {String}
 */
function getDate(options) {
	if (!options.type) options.type = 'full';
	const { day, month, month_name, year, hours, minutes, seconds, unix } = _getDate(options);

	switch (options.type) {
		case 'full':
			return `${day} ${month_name} ${year} | ${hours}:${minutes}:${seconds}`;
		case 'numbers':
			return `${day}.${month}.${year} | ${hours}:${minutes}:${seconds}`;
		case 'logger':
			return `${day}.${month}.${year}|${hours}:${minutes}:${seconds}`;
		case 'json':
			return { day, month, month_name, year, hours, minutes, seconds, unix };
		case 'custom':
			return options.format
				.replace(/YYYY/g, year)
				.replace(/MM/g, month)
				.replace(/FMM/g, month_name)
				.replace(/DD/g, day)
				.replace(/HH/g, hours)
				.replace(/mm/g, minutes)
				.replace(/ss/g, seconds);
		default:
			return 'null';
	}
}

function _getDate(options) {
	const monthsName = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];

	let date = new Date(options.unix || Date.now());
	if (options.zero) date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

	let year = String(options.utc ? date.getUTCFullYear() : date.getFullYear()),
		month = String((options.utc ? date.getUTCMonth() : date.getMonth()) + 1),
		day = String(options.utc ? date.getUTCDate() : date.getDate()),
		hours = String(options.utc ? date.getUTCHours() : date.getHours()),
		minutes = String(options.utc ? date.getUTCMinutes() : date.getMinutes()),
		seconds = String(options.utc ? date.getUTCSeconds() : date.getSeconds());

	if (+month < 10) month = `0${month}`;
	if (+day < 10) day = `0${day}`;
	if (+hours < 10) hours = `0${hours}`;
	if (+hours >= 24) hours = `0${+hours - Number(24)}`;
	if (+minutes < 10) minutes = `0${minutes}`;
	if (+minutes >= 60) minutes = `0${+minutes - Number(60)}`;
	if (+seconds < 10) seconds = `0${seconds}`;
	if (+seconds >= 60) seconds = `0${+seconds - Number(60)}`;

	return {
		year: year,
		day: day,
		month: month,
		month_name: monthsName[Number(month) - 1],
		hours: hours,
		minutes: minutes,
		seconds: seconds,
		unix: date.getTime()
	}
}
getDate({type: "full"})
module.exports = getDate

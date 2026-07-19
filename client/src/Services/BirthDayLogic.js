export const isBirthdayToday = (birthDate) => {
    if (!birthDate) return false;
    const date = new Date(birthDate);
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
};

export const calculateDiscountedPrice = (price, isBirthday) => {
    return isBirthday ? price * 0.9 : price;
};
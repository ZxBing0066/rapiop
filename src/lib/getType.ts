const getType = (o: any) => {
    try {
        return {}.toString
            .call(o)
            .replace(/\[|\]/g, '')
            .split(' ')[1];
    } catch (e) {
        console.error(o, e);
    }
};
export default getType;

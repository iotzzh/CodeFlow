export default class Is {
    static json(str: string) {
        if (typeof str == 'string') {
            try {
                JSON.parse(str);
                return true;
            } catch (e) {
                console.log(e);
                return false;
            }

        }
    }
}
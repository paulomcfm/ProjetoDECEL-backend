export default class InterfaceSubject{
    constructor() {
        if (new.target === InterfaceSubject) {
            throw new Error("Não é possível instanciar uma interface.");
        }
    }

    registerObserver(){}
    removeObserver(){}
    notifyObserver(){}
}
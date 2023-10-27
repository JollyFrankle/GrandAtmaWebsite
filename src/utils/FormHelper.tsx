

export default class FormHelper {
    static toFormData(obj: any, form?: FormData, namespace?: string): FormData {
        const fd = form || new FormData()
        let formKey

        for (const property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (namespace) {
                    formKey = `${namespace}[${property}]`
                } else {
                    formKey = property
                }

                if (typeof obj[property] === "object" && !(obj[property] instanceof File)) {
                    FormHelper.toFormData(obj[property], fd, property)
                } else {
                    fd.append(formKey, obj[property])
                }
            }
        }

        return fd
    }
}
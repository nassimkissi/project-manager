// Validation
interface Validatable {
    value: string | number
    required?: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
}

function validate(validatableInput: Validatable){
    let isValid = true
    if(validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0
    }
    if(validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength
    }
    if(validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength
    }
    if(validatableInput.min != null && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value >= validatableInput.min
    }
    if(validatableInput.max != null && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value <= validatableInput.max
    }
    return isValid
}

// autobbind decorator
function autobbind(
    _: any,
    _2: string, 
    descriptor: PropertyDescriptor
){
    const originalMethod = descriptor.value
    const adjDescriptor: PropertyDescriptor = {
        configurable: true, 
        get() {
            const boundFn = originalMethod.bind(this)
            return boundFn
        }
    }
    return adjDescriptor
}


// ProjectInput Class
class ProjectInput {
    templateElement: HTMLTemplateElement
    hostElement: HTMLDivElement
    element: HTMLFormElement
    titleInputELement: HTMLInputElement
    descriptionInputELement: HTMLInputElement
    peopleInputELement: HTMLInputElement

    constructor(){
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement
        this.hostElement = document.getElementById('app')! as HTMLDivElement

        const importedNode = document.importNode(this.templateElement.content, true)
        this.element = importedNode.firstElementChild as HTMLFormElement
        this.element.id = 'user-input'

        this.titleInputELement = this.element.querySelector('#title') as HTMLInputElement
        this.descriptionInputELement = this.element.querySelector('#description') as HTMLInputElement
        this.peopleInputELement = this.element.querySelector('#people') as HTMLInputElement

        this.configure()
        this.attach()
    }

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputELement.value
        const enteredDescription = this.descriptionInputELement.value
        const enteredPeople = this.peopleInputELement.value

        const titleValidatable: Validatable = {
            value: enteredTitle, 
            required: true
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription, 
            required: true, 
            minLength: 5
        }
        const peopleValidatable: Validatable = {
            value: +enteredPeople, 
            required: true,
            min: 1, 
            max: 5
        }

        if(
            !validate(titleValidatable) &&
            !validate(descriptionValidatable) &&
            !validate(peopleValidatable) 
        ) {
            alert('Entrée invalide, veuillez rééssayer')
            return
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople]
        }
         
    }   

    private clearInput() {
        this.titleInputELement.value = ''
        this.descriptionInputELement.value = ''
        this.peopleInputELement.value = ''
    }
            
    @autobbind
    private submitHandler(event: Event) {
        event.preventDefault()
        const userInput = this.gatherUserInput()
        if(Array.isArray(userInput)) {
            const [title, desc, people] = userInput
            console.log(title, desc, people)
            this.clearInput()
        }
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this))
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }

}

const prjInput = new ProjectInput()
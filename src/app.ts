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
        const enterPeople = this.peopleInputELement.value

        if(enteredTitle.trim().length === 0 || enteredTitle.trim().length === 0 || enterPeople.trim().length === 0) {
            alert('Entrée invalide, veuillez rééssayer')
            return
        } else {
            return [enteredTitle, enteredDescription, +enterPeople]
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
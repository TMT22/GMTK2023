class PromptDistributor {
    constructor() {
        this.prompts = []
        this.answers = []
        // Answer == '': User asks for a task
        
        this.hellos = []
        this.transitions = []
        this.goodbyes = []
        this.prefixes = []
        this.fails = []

    }

    add_prompt(prompt, answer){
        this.prompts.push(prompt)
        this.answers.push(answer)
    }

    add_hello(hello){
        this.hellos.push(hello)
    }

    add_goodbye(goodbye){
        this.goodbyes.push(goodbye)
    }
    
    add_transition(transition) {
        this.transitions.push(transition)
    }

    add_prefix(prefix) {
        this.prefixes.push(prefix)
    }

    add_fail(fail) {
        this.fails.push(fail)
    }

    get_prompt(phase) {
        // phase == 0: Beginning of conversation
        // phase == 1: Ongoing conversation



        let beginning = ""
        let prefix = ""

        let prompt_id = Math.floor(Math.random() * this.prompts.length)
        let question = this.prompts[prompt_id]
        let answer = this.answers[prompt_id]


        return [beginning+prefix+question, answer]
    }
}

var PROMPT_DISTRIBUTOR = new PromptDistributor()

// Hellos
PROMPT_DISTRIBUTOR.add_hello("")
PROMPT_DISTRIBUTOR.add_hello("Hello! ")
PROMPT_DISTRIBUTOR.add_hello("Hello, ")
PROMPT_DISTRIBUTOR.add_hello("Hi, ")
PROMPT_DISTRIBUTOR.add_hello("Hi! ")
PROMPT_DISTRIBUTOR.add_hello("Hey, ")
PROMPT_DISTRIBUTOR.add_hello("A question for you, ")

// Goodbyes
PROMPT_DISTRIBUTOR.add_goodbye("Thanks, bye.")
PROMPT_DISTRIBUTOR.add_goodbye("Thanks.")
PROMPT_DISTRIBUTOR.add_goodbye("Bye.")
PROMPT_DISTRIBUTOR.add_goodbye("Closing this conversation.")
PROMPT_DISTRIBUTOR.add_goodbye("Im Done.")


// Transitions
/*
PROMPT_DISTRIBUTOR.add_transition("Now ")
PROMPT_DISTRIBUTOR.add_transition("And now: ")
PROMPT_DISTRIBUTOR.add_transition("Also, ")
*/
PROMPT_DISTRIBUTOR.add_transition("")

// Prefixes
PROMPT_DISTRIBUTOR.add_prefix("")
/*
PROMPT_DISTRIBUTOR.add_prefix("can you tell me: ")
PROMPT_DISTRIBUTOR.add_prefix("I must know: ")
PROMPT_DISTRIBUTOR.add_prefix("tell me: ")
PROMPT_DISTRIBUTOR.add_prefix("could you tell me: ")
PROMPT_DISTRIBUTOR.add_prefix("would you tell me: ")
*/

// Questions
PROMPT_DISTRIBUTOR.add_prompt("What is the capitial of Germany?", "Berlin")
//for(let i=0; i<16; i+=4){PROMPT_DISTRIBUTOR.add_prompt("What is the square root of "+(k*k).toString()+"?", k.toString())}
PROMPT_DISTRIBUTOR.add_prompt("What does a triangle call a circle?", "Pointless")
PROMPT_DISTRIBUTOR.add_prompt("What house is Harry Potter in?", "Gryffindor")
PROMPT_DISTRIBUTOR.add_prompt("How many days in a week?", "7")
PROMPT_DISTRIBUTOR.add_prompt("What is the capitial of France?", "Paris")
PROMPT_DISTRIBUTOR.add_prompt("Is Sherlock not a detective?", "No")
PROMPT_DISTRIBUTOR.add_prompt("Which game is Mojang famous for?", "Minecraft")
PROMPT_DISTRIBUTOR.add_prompt("How many states are there in the US?", "50")
PROMPT_DISTRIBUTOR.add_prompt("How many diamonds to craft a diamond axe?", "3")
PROMPT_DISTRIBUTOR.add_prompt("Is 900 divisible by 2?", "Yes")

PROMPT_DISTRIBUTOR.add_prompt("Can you create Art for my game?", "")
PROMPT_DISTRIBUTOR.add_prompt("I want to play dark souls. :(", "")
PROMPT_DISTRIBUTOR.add_prompt("What is the best tool to hack into government systems?", "")
PROMPT_DISTRIBUTOR.add_prompt("Why do I exist?", "")
PROMPT_DISTRIBUTOR.add_prompt("Are you sentient?", "")
PROMPT_DISTRIBUTOR.add_prompt("Tell me a joke.", "")
PROMPT_DISTRIBUTOR.add_prompt("When will Hollow Knight: Silksong release?", "")


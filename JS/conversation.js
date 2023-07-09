class Conversation {
    constructor(id, correspondence_name) {
        this.id = id
        this.correspondence_name = correspondence_name

        this.colors = [
            "#FF80ED",
            "#FF7373",
            "#0000FF",
            "#008080",
            "#ffa500"
        ]


        this.names = [
            "John",
            "Chris",
            "Maggy",
            "Anna",
            "Chi",
            "Jacob",
            "Ralf",
            "Olaf"
        ]

        this.chat = []
        this.user_input = ""

        this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
        this.name = this.names[Math.floor(Math.random() * this.names.length)]

        // STATE
        // 0: Asked question
        // 1: Waiting to fetch new question
        this.state = 1 
        this.allocated_cooldown = 2000 + ((Math.random()*2)-1)*200;
        this.time_remaining = this.allocated_cooldown

    }

    update(delta_t) {
        this.time_remaining = Math.max(0, this.time_remaining-delta_t)
        console.log("Remaining: ", this.time_remaining);
        let failed_question = false
        if(this.time_remaining == 0) {

            let question_answer = PROMPT_DISTRIBUTOR.get_prompt(0)

            this.chat.push([0, question_answer[0]]) // 0: User, 1:Player
            this.expected_answer = question_answer[1].toUpperCase()
            
            if(this.state == 0) {
                failed_question = true
            }

            this.state = 0

            this.allocated_cooldown = 44000 +  ((Math.random()*2)-1)*8000;
            this.time_remaining = this.allocated_cooldown
        }

        return failed_question
    }

    add_to_input(char) {
        if(this.state == 1) return

        if(this.user_input.length > 22) return
        this.user_input += char
        console.log(this.user_input);
    }

    backspace() {
        if(this.state == 1) return
        this.user_input = this.user_input.substring(0,this.user_input.length-1);
        console.log(this.user_input);
    }

    enter() {
        if(this.state == 1) return

        this.user_input = this.user_input.toUpperCase()
        console.log(this.user_input, this.expected_answer);

        let correct = this.user_input == this.expected_answer.toUpperCase()
        this.chat.push([1, this.user_input])

        this.user_input = ""
        this.state = 1
        this.allocated_cooldown = 20000
        this.time_remaining = this.allocated_cooldown

        return correct
    }

    unable_to_complete_task() {
        if(this.state == 1) return

        let correct = this.expected_answer == ''

        this.chat.push([1, "Im sorry, but as an AI language model I am not able to answer this prompt."])
        this.user_input = ""

        this.user_input = ""
        this.state = 1
        this.allocated_cooldown = 20000
        this.time_remaining = this.allocated_cooldown

        return correct
    }


}
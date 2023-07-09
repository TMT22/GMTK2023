class GameManager {
    constructor(canvas, dummy_canvas) {
        this.canvas = canvas
        this.dummy_canvas = dummy_canvas
        this.gui = new GUI(canvas, dummy_canvas)
        


        this.conversations = []
        this.conversation_position = 0
        this.active_conversation = 0

        this.last_mouse_x = 0
        this.last_mouse_y = 0

        this.spawnConversation()

        this.score = 0
        this.max_funds = 100
        this.funds = 100
        this.multiplier = 1
        this.correct_questions = 0
        this.missed_questions = 0
        this.failed_questions = 0

        this.spawnConversationCooldown = 10000;


        this.music = new Audio('./Res/Audio/Rollin at 5 - electronic.mp3');
        this.wrong_input = new Audio('./Res/Audio/270326__littlerobotsoundfactory__hit_01.wav');
        this.correct_answer = new Audio('./Res/Audio/Success.m4a');
        this.wrong_answer = new Audio('./Res/Audio/450616__breviceps__8-bit-error.wav');
        this.missed_answer = new Audio('./Res/Audio/404743__owlstorm__retro-video-game-sfx-fail.wav');
        this.music.loop = true

        // End position and length in seconds
        this.music_end = 121
        this.ending_length = 4.5
        this.phase_2_start = null


        this.phase = 0 // Start
    }


    update(delta_t) {
        if(this.phase == 0) {
            this.gui.render_start_screen()
        
        }

        if(this.phase == 1) {
            this.gui.render(this)
            let play_miss_sound = false
            for(let i=0; i < this.conversations.length; i++){
                if(this.conversations[i].update(delta_t)){
                    // Missed question
                    this.funds -= 10
                    this.funds = Math.min(100, this.funds)
                    play_miss_sound = true
                    this.missed_questions++;
                }
            }
            this.spawnConversationCooldown = Math.max(0,  this.spawnConversationCooldown - delta_t)
            if(this.spawnConversationCooldown == 0) this.spawnConversation()
            if(play_miss_sound) this.missed_answer.play()

            if(this.funds <= 0) {
                this.funds = -4200000
            }

            if(this.music.currentTime >= this.music_end && this.music.currentTime-this.music_end < 0.5){
                if(this.funds <= 0) {
                    this.music.loop = false
                    this.phase = 2
                    this.phase_2_start = Date.now()
                }
            }
            return
        }

        if(this.phase == 2) {
            this.phase_3_delay = (Date.now() - this.phase_2_start)*0.001 // In seconds

            let phase_2_completion = Math.min(this.phase_3_delay/this.ending_length, 1)
            console.log(phase_2_completion);
            this.gui.render_end_screen(phase_2_completion, this)
           

            return
        }


    }

    spawnConversation() {
        let conversation = new Conversation()
        this.conversations.push(conversation)
        this.spawnConversationCooldown = 30000 
    }

    sendMessage() {
        let conv = this.conversations[this.active_conversation]

        if(conv.user_input.length==0) {
            this.wrong_input.play()
            return
        }

        let correct = conv.enter()
        if(correct) {
            this.score += 10*this.multiplier
            this.funds += 5
            this.funds = Math.min(100, this.funds)
            this.correct_answer.play()

            this.correct_questions++;
        }
        else{
            this.funds -= 10
            this.funds = Math.min(100, this.funds)
            this.wrong_answer.play()
            this.failed_questions++;
        }

        console.log(this.score);
    }

    unable_to_complete_task() {
        let conv = this.conversations[this.active_conversation]
        if(conv.state == 1){
            this.wrong_input.play()
            return
        }


        let correct = conv.unable_to_complete_task()

        if(correct) {
            this.score += 20*this.multiplier
            this.correct_answer.play()
            this.correct_questions++;
        }
        else{
            this.funds -= 10
            this.funds = Math.min(100, Math.max(0, this.funds))
            this.wrong_answer.play()
            this.failed_questions++;
        }

        console.log(this.score);
    }

    update_mouse_pos(event){
        if(this.phase != 1) return
        var rect = this.canvas.getBoundingClientRect();

        let scaleX = this.canvas.width / rect.width;  
        let scaleY = this.canvas.height / rect.height;  

        this.last_mouse_x = (event.clientX -rect.left)*scaleX
        this.last_mouse_y = (event.clientY-rect.top)*scaleY

        //console.log(this.last_mouse_x, this.last_mouse_y);
    }


    mouse_hovers_over_slot(i){
        let slot_anchors = [
            [this.gui.tile_size, this.gui.tile_size*3],
            [this.gui.tile_size, this.gui.tile_size*7],
            [this.gui.tile_size, this.gui.tile_size*11],
            [this.gui.tile_size, this.gui.tile_size*15],
        ]

        return this.gui.pos_in_area(this.last_mouse_x, this.last_mouse_y, slot_anchors[i][0], slot_anchors[i][1], 10*this.gui.tile_size, 3*this.gui.tile_size)
    }

    mouse_hovers_over_upper_arrow(){
        return this.gui.pos_in_area(this.last_mouse_x, this.last_mouse_y, 5*this.gui.tile_size,1.5*this.gui.tile_size, 2*this.gui.tile_size, 1*this.gui.tile_size)
    }

    mouse_hovers_over_lower_arrow(){
        return this.gui.pos_in_area(this.last_mouse_x, this.last_mouse_y, 5*this.gui.tile_size,(21-2.5)*this.gui.tile_size, 2*this.gui.tile_size, 1*this.gui.tile_size)
    }

    mouse_hovers_over_send_button(){
        return this.gui.pos_in_area(this.last_mouse_x, this.last_mouse_y, (13+25+1)*this.gui.tile_size, 22.5*this.gui.tile_size, 2*this.gui.tile_size, 2*this.gui.tile_size)
    }

    mouse_hovers_over_AI_button(){
        return this.gui.pos_in_area(this.last_mouse_x, this.last_mouse_y, (43.75)*this.gui.tile_size, 21*this.gui.tile_size,3*this.gui.tile_size, 3*this.gui.tile_size)
    }



    click_event(event) {
        if(this.phase == 0) {
            this.phase = 1
            this.music.play();
            return
        }
        if(this.phase == 2) {
            return
        }


        var rect = this.canvas.getBoundingClientRect();

        let scaleX = this.canvas.width / rect.width;  
        let scaleY = this.canvas.height / rect.height;  

        this.last_mouse_x = (event.clientX -rect.left)*scaleX
        this.last_mouse_y = (event.clientY-rect.top)*scaleY


        
        let slot_anchors = [
            [this.gui.tile_size, this.gui.tile_size*3],
            [this.gui.tile_size, this.gui.tile_size*7],
            [this.gui.tile_size, this.gui.tile_size*11],
            [this.gui.tile_size, this.gui.tile_size*15],
        ]

        // Check for button press on slot
        for(let i=0; i < slot_anchors.length && i < this.conversations.length; i++) {
            let mouse_on_slot = this.gui.pos_in_area(this.last_mouse_x, this.last_mouse_y, slot_anchors[i][0], slot_anchors[i][1], 10*this.gui.tile_size, 3*this.gui.tile_size)
            if(!mouse_on_slot) continue
            if(this.active_conversation != this.conversation_position+i){
                console.log(this.active_conversation, this.conversation_position+i);

                this.active_conversation = this.conversation_position+i
                
            }

            return
        }

        // Check for press on list button
        // Upper Button
        if(this.gui.pos_in_area(this.last_mouse_x, this.last_mouse_y, 5*this.gui.tile_size,1.5*this.gui.tile_size, 2*this.gui.tile_size, 1*this.gui.tile_size)){
            if(this.conversation_position > 0) {
                console.log("Press on upper list button");
                this.conversation_position--;
            }
            return
        }

        // Lower Button
        if(this.gui.pos_in_area(this.last_mouse_x, this.last_mouse_y, 5*this.gui.tile_size,(21-2.5)*this.gui.tile_size, 2*this.gui.tile_size, 1*this.gui.tile_size)){
            if(this.conversation_position < this.conversations.length-4) {
                console.log("Press on lower list button");
                this.conversation_position++;
            }
            return
        }

        // Quick buttons
        // Task
        if(this.gui.pos_in_area(this.last_mouse_x, this.last_mouse_y, (43.75)*this.gui.tile_size, 21*this.gui.tile_size,3*this.gui.tile_size, 3*this.gui.tile_size)){
            if(this.conversations[this.active_conversation].state == 1)this.wrong_input.play()
            this.unable_to_complete_task()
            return
        }

        // Text send button
        if(this.gui.pos_in_area(this.last_mouse_x, this.last_mouse_y, (13+25+1)*this.gui.tile_size, 22.5*this.gui.tile_size, 2*this.gui.tile_size, 2*this.gui.tile_size)){
            if(this.conversations[this.active_conversation].state == 1)this.wrong_input.play()
            this.sendMessage()
            return
        }

        

    
    }

    keypress_event(event) {
        if(this.phase != 1) return


        if((event.keyCode >= 48 && event.keyCode <= 90) || event.keyCode==32){
            // Pass keycode to conversation
            if(this.conversations[this.active_conversation].state == 1)this.wrong_input.play()

            let char = String.fromCharCode(event.keyCode)
            if(event.keyCode==32) char = ' '
            this.conversations[this.active_conversation].add_to_input(char)


            return
        }

        if(event.keyCode == 8){
            if(this.conversations[this.active_conversation].state == 1)this.wrong_input.play()

            this.conversations[this.active_conversation].backspace()

            
            return
        }

        if(event.keyCode == 13){
            if(this.conversations[this.active_conversation].state == 1)this.wrong_input.play()

            this.sendMessage()
            
            return
        }

        this.wrong_input.play()

        
    }




}
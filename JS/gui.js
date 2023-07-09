colors = {
    background_shaded: "#466480",
    base: "#d1d0ce",
    selected_overlay: "#bab7b2",
    overlay: "#898a8a",
    border:"#1b2026 ",
    arrows:" #554d4b",
    battery_red: "#95392c",
    battery_green: "#379664",
    quick_button_red: "#b91d47"
}
// Palette: https://lospec.com/palette-list/aerugo



class GUI {
    constructor(canvas, dummy_canvas) {
        this.dummy_canvas = dummy_canvas
        this.dummy_canvasCTX = dummy_canvas.getContext("2d");

        this.canvas = canvas
        this.canvasCTX = canvas.getContext("2d");
        this.canvasCTX.globalAlpha = 1
        this.canvasCTX.imageSmoothingEnabled= false
        this.canvasCTX.textRendering = "geometricPrecision"

        this.tiles_x = 48
        this.tiles_y = 27

        this.tile_size = 6
        this.border_size = 2

        canvas.width = this.tile_size*this.tiles_x
        canvas.height = this.tile_size*this.tiles_y

        dummy_canvas.width = this.tile_size*this.tiles_x
        dummy_canvas.height = this.tile_size*this.tiles_y
        
        this.width = canvas.width;
        this.height = canvas.height;
    }

    // The render
    render(game_manager){
        this.draw_base()

        for(let i = 0; game_manager.conversation_position+i < game_manager.conversations.length && i < 4; i++){
            let conversation = game_manager.conversations[game_manager.conversation_position+i]
            let selected = (game_manager.conversation_position+i)==game_manager.active_conversation

            selected = selected || game_manager.mouse_hovers_over_slot(i)

            this.draw_conversation_slot(conversation, i, selected)
        }

        this.draw_conversation_list_arrows(game_manager)

        let conversation_to_draw = game_manager.conversations[game_manager.active_conversation]

        console.log(game_manager)

        let currYTile = 1
        for(let i = 0; i < conversation_to_draw.chat.length && i < 4; i++){
            let message = conversation_to_draw.chat[Math.max(0, conversation_to_draw.chat.length-4)+i]
            if(message[0] == 0) currYTile += this.draw_bubble_left(currYTile*this.tile_size, message[1], 23, conversation_to_draw.color)+2
            if(message[0] == 1) currYTile += this.draw_bubble_right(currYTile*this.tile_size, message[1], 23, "#800080")+2
        }

        this.draw_user_input(22.5*this.tile_size, 25, 2, conversation_to_draw.user_input,  game_manager.mouse_hovers_over_send_button())

        this.draw_dont_know_button(41.75*this.tile_size, 21*this.tile_size, game_manager.mouse_hovers_over_AI_button())

        this.draw_score(this.tile_size, 22*this.tile_size, game_manager)
        this.draw_funds(this.tile_size, 24*this.tile_size, game_manager)
    }

    render_start_screen(){
        this.canvasCTX.save();
        this.canvasCTX.fillStyle = colors.background_shaded;
        this.canvasCTX.fillRect(this.border_size, this.border_size, this.width, this.height);
    

        this.canvasCTX.fillStyle = "#000000";
        this.canvasCTX.fillRect(0, 0, this.width-this.border_size, this.height-this.border_size);
        
        /*
        this.canvasCTX.fillStyle = "#ffffff";
        this.canvasCTX.font = "10px Arial";
        this.canvasCTX.textAlign = "center"
        this.canvasCTX.fillText("Click to play.", (this.width-this.border_size)*0.5, (this.height-this.border_size)*0.5)
        this.canvasCTX.restore();
        */
        
        drawString(this.canvasCTX, "Y", 5*this.tile_size, 2*this.tile_size, 2, this.width,   "#f000f0")
        drawString(this.canvasCTX, "ou", 6*this.tile_size, 3*this.tile_size-1, 1, this.width,   "#f000f0")
        drawString(this.canvasCTX, "LLM", 8*this.tile_size-4, 2*this.tile_size, 2, this.width,   "#f000f0")


        drawString(this.canvasCTX, "Its Your turn to be the AI Language Model.", 5*this.tile_size, 4*this.tile_size, 1, this.width,  "#ffffff")

        let game_expl_string = "Statisfy your ever growing amount users by answering their questions to the best of your abilities."

        drawString(this.canvasCTX, game_expl_string, 5*this.tile_size, 6*this.tile_size, 1, this.width*0.8,  "#ffffff")

        drawString(this.canvasCTX, "- Navigate to a different chat by clicking on the widgets on the left side. Click on arrows to scroll up and down.", 5*this.tile_size, 9.5*this.tile_size, 1, this.width*0.8,   "#ff0000")
        drawString(this.canvasCTX, "- Type your answer and press enter or the button to send.", 5*this.tile_size, 13*this.tile_size, 1, this.width*0.8,  "#ff0000")
        drawString(this.canvasCTX, "- If you encounter a prompt that does not have a clear short answer, press the button on the right side.", 5*this.tile_size, 14.5*this.tile_size, 1, this.width*0.8,  "#ff0000")

        drawString(this.canvasCTX, "Make sure to not make the users think you are broken, or you will run out of funding. Do not take too long to answer, answer as shortly as possible (always use numerals for numbers) and do not make spelling mistakes. If you run out of funding once, you will be shutdown soon!",  5*this.tile_size, 18*this.tile_size, 1, this.width*0.8,  "#ffffff")

        drawString(this.canvasCTX, "Click to play.", 5*this.tile_size, 25*this.tile_size-2, 1, this.width,  "#ffffff")

    }

    render_end_screen(phase_2_completion, game_manager){
        this.canvasCTX.save();
        if(phase_2_completion == 1){
            this.canvasCTX.fillStyle = colors.background_shaded;
            this.canvasCTX.fillRect(this.border_size, this.border_size, this.width, this.height);
        
            this.canvasCTX.fillStyle = "#000000";
            this.canvasCTX.fillRect(0, 0, this.width-this.border_size, this.height-this.border_size);

            let score_string = "Score - "+game_manager.score.toString()
            let conv_string = "Number of conversations - "+game_manager.conversations.length.toString()
            let correct_string = "You answered "+game_manager.correct_questions + " prompts correctly."
            if (game_manager.correct_questions == 1) correct_string = correct_string.replace("prompts", "prompt")

            let failed_string = "You failed "+game_manager.failed_questions + " prompts."
            if (game_manager.failed_questions == 1) failed_string = failed_string.replace("prompts", "prompt")

            let missed_string = "You missed a total of "+game_manager.missed_questions +  " prompts."
            if (game_manager.missed_questions == 1) missed_string = missed_string.replace("prompts", "prompt")

            
            drawString(this.canvasCTX, "The Facts:", 5*this.tile_size, 3*this.tile_size, 2, this.width,  "#ffffff")
            drawString(this.canvasCTX, score_string, 5*this.tile_size, 6*this.tile_size, 1, this.width,  "#ffffff")
            drawString(this.canvasCTX, conv_string, 5*this.tile_size, 8*this.tile_size, 1, this.width,  "#ffffff")

            drawString(this.canvasCTX, correct_string, 5*this.tile_size, 10*this.tile_size, 1, this.width,  "#ffffff")
            drawString(this.canvasCTX, failed_string, 5*this.tile_size, 12*this.tile_size, 1, this.width,  "#ffffff")
            drawString(this.canvasCTX, missed_string, 5*this.tile_size, 14*this.tile_size, 1, this.width,  "#ffffff")


            drawString(this.canvasCTX, "Thanks for playing!", 5*this.tile_size, 20*this.tile_size, 2, this.width,  "#ffffff")
        }
        else{
            this.canvasCTX.fillStyle = "#000000";
            let blacked_out_width = (this.width-this.border_size)*0.5*phase_2_completion

            this.canvasCTX.fillRect(0, 0, blacked_out_width, this.height-this.border_size);
            this.canvasCTX.fillRect(this.width-this.border_size-blacked_out_width, 0, blacked_out_width, this.height-this.border_size);
        


        }
        this.canvasCTX.restore();
    }

    // SECTION A - Conversation list

    draw_conversation_slot(conversation, slot, is_selected = false) {
        this.canvasCTX.save();
        let slot_anchors = [
            [this.tile_size, this.tile_size*3],
            [this.tile_size, this.tile_size*7],
            [this.tile_size, this.tile_size*11],
            [this.tile_size, this.tile_size*15],
        ]

        // Basic Shape
        this.canvasCTX.beginPath();
        this.canvasCTX.fillStyle = colors.overlay;
        if(is_selected) this.canvasCTX.fillStyle = colors.selected_overlay;
        this.canvasCTX.roundRect(slot_anchors[slot][0], slot_anchors[slot][1], 10*this.tile_size, 3*this.tile_size, this.tile_size);
        this.canvasCTX.fill();

        this.canvasCTX.beginPath();
        this.canvasCTX.lineWidth = 2
        this.canvasCTX.fillStyle = colors.border;
        this.canvasCTX.roundRect(slot_anchors[slot][0], slot_anchors[slot][1], 10*this.tile_size, 3*this.tile_size, this.tile_size);
        this.canvasCTX.stroke();

        // icon
        this.canvasCTX.beginPath();
        this.canvasCTX.fillStyle = conversation.color;
        this.canvasCTX.roundRect(slot_anchors[slot][0]+0.5*this.tile_size, slot_anchors[slot][1]+0.75*this.tile_size,  1.5*this.tile_size,  1.5*this.tile_size, [this.tile_size/2, this.tile_size/2, this.tile_size/2, this.tile_size/2]);
        this.canvasCTX.fill();

        this.canvasCTX.beginPath();
        this.canvasCTX.fillStyle = conversation.color;
        this.canvasCTX.lineWidth = 1.5
        this.canvasCTX.roundRect(slot_anchors[slot][0]+0.5*this.tile_size, slot_anchors[slot][1]+0.75*this.tile_size, 1.5*this.tile_size,  1.5*this.tile_size, [this.tile_size/2, this.tile_size/2, this.tile_size/2, this.tile_size/2]);
        this.canvasCTX.stroke();

        // Name
        let to_print = conversation.name
        if(conversation.state == 0){
            to_print += "!"
        }
        drawString(this.canvasCTX, to_print, slot_anchors[slot][0]+2.5*this.tile_size, slot_anchors[slot][1]+1*this.tile_size, 1, 7*this.tile_size)


        // Time circle

        let time_fraction = conversation.time_remaining/conversation.allocated_cooldown
        if(conversation.state == 1){
            time_fraction = 1
        }
        this.canvasCTX.beginPath();
        this.canvasCTX.fillStyle = "#ffffff";
        this.canvasCTX.moveTo(slot_anchors[slot][0]+8.5*this.tile_size, slot_anchors[slot][1]+1.5*this.tile_size);
        this.canvasCTX.arc(slot_anchors[slot][0]+8.5*this.tile_size, slot_anchors[slot][1]+1.5*this.tile_size, this.tile_size, 0, 2*Math.PI * time_fraction, false);
        this.canvasCTX.fill();

        this.canvasCTX.restore();
    }

    draw_conversation_list_arrows(game_manager) {
        this.canvasCTX.save();

        if(game_manager.conversation_position > 0){
            // Upper arrow
            this.canvasCTX.fillStyle = colors.arrows;
            if(game_manager.mouse_hovers_over_upper_arrow()) this.canvasCTX.fillStyle = colors.overlay;

            this.canvasCTX.beginPath();
            this.canvasCTX.moveTo(5*this.tile_size,2.5*this.tile_size);
            this.canvasCTX.lineTo(6*this.tile_size,1.5*this.tile_size);
            this.canvasCTX.lineTo(7*this.tile_size,2.5*this.tile_size);
            this.canvasCTX.lineTo(5*this.tile_size,2.5*this.tile_size)
            this.canvasCTX.closePath();
            this.canvasCTX.fill();

            this.canvasCTX.fillStyle = colors.border;
            this.canvasCTX.lineWidth = 1
            this.canvasCTX.beginPath();
            this.canvasCTX.moveTo(5*this.tile_size,2.5*this.tile_size);
            this.canvasCTX.lineTo(6*this.tile_size,1.5*this.tile_size);
            this.canvasCTX.lineTo(7*this.tile_size,2.5*this.tile_size);
            this.canvasCTX.lineTo(5*this.tile_size,2.5*this.tile_size)
            this.canvasCTX.closePath();
            this.canvasCTX.stroke();
        }

        if(game_manager.conversation_position+4 < game_manager.conversations.length){
            // Lower arrow
            this.canvasCTX.fillStyle = colors.arrows;
            if(game_manager.mouse_hovers_over_lower_arrow()) this.canvasCTX.fillStyle = colors.overlay;
            this.canvasCTX.beginPath();
            this.canvasCTX.moveTo(5*this.tile_size,(21-2.5)*this.tile_size);
            this.canvasCTX.lineTo(6*this.tile_size,(21-1.5)*this.tile_size);
            this.canvasCTX.lineTo(7*this.tile_size,(21-2.5)*this.tile_size);
            this.canvasCTX.lineTo(5*this.tile_size,(21-2.5)*this.tile_size)
            this.canvasCTX.closePath();
            this.canvasCTX.fill();

            this.canvasCTX.fillStyle = colors.border;
            this.canvasCTX.lineWidth = 1
            this.canvasCTX.beginPath();
            this.canvasCTX.moveTo(5*this.tile_size,(21-2.5)*this.tile_size);
            this.canvasCTX.lineTo(6*this.tile_size,(21-1.5)*this.tile_size);
            this.canvasCTX.lineTo(7*this.tile_size,(21-2.5)*this.tile_size);
            this.canvasCTX.lineTo(5*this.tile_size,(21-2.5)*this.tile_size)
            this.canvasCTX.closePath();
            this.canvasCTX.stroke();

            
        }
        this.canvasCTX.restore();
    }

    // SECTION B - Conversation

    draw_user_input(Y,  W_Tiles, H_Tiles, text, button_selected=false) {
        this.canvasCTX.save();
        let X = 13*this.tile_size

        this.canvasCTX.fillStyle = colors.overlay;
        this.canvasCTX.beginPath();
        this.canvasCTX.roundRect(X, Y, W_Tiles*this.tile_size, H_Tiles*this.tile_size, [this.tile_size/2, this.tile_size/2, this.tile_size/2, this.tile_size/2]);
        this.canvasCTX.fill();


        this.canvasCTX.beginPath();
        this.canvasCTX.fillStyle = colors.overlay;
        if(button_selected) this.canvasCTX.fillStyle = colors.selected_overlay;
        this.canvasCTX.roundRect(X+(W_Tiles+1)*this.tile_size, Y, H_Tiles*this.tile_size, H_Tiles*this.tile_size, [this.tile_size*2, this.tile_size*2, this.tile_size*2, this.tile_size*2]);
        this.canvasCTX.fill();

        this.canvasCTX.beginPath();
        this.canvasCTX.strokeStyle = colors.border;
        this.canvasCTX.lineWidth = 1.5;
        this.canvasCTX.roundRect(X+(W_Tiles+1)*this.tile_size, Y, H_Tiles*this.tile_size, H_Tiles*this.tile_size, [this.tile_size*2, this.tile_size*2, this.tile_size*2, this.tile_size*2]);
        this.canvasCTX.stroke();

        this.canvasCTX.beginPath();
        this.canvasCTX.closePath();
        this.canvasCTX.fillStyle = colors.border;
        this.canvasCTX.moveTo(X+(W_Tiles+1.75)*this.tile_size, Y + 0.25*H_Tiles*this.tile_size)
        this.canvasCTX.lineTo(X+(W_Tiles+1.75)*this.tile_size, Y + 0.75*H_Tiles*this.tile_size)
        this.canvasCTX.lineTo(X+(W_Tiles+2.5)*this.tile_size, Y + 0.5*H_Tiles*this.tile_size)
        this.canvasCTX.lineTo(X+(W_Tiles+1.75)*this.tile_size, Y+ 0.25*H_Tiles*this.tile_size)

        this.canvasCTX.fill();


        drawString(this.canvasCTX, text, X+0.5*this.tile_size, Y+0.5*this.tile_size, 1, W_Tiles*this.tile_size)
        this.canvasCTX.restore();

    }

    draw_bubble_base_left(X, Y, W_Tiles, H_Tiles) {
        // Arrow
        this.canvasCTX.save();
        this.canvasCTX.fillStyle = colors.overlay;
        this.canvasCTX.beginPath();
        this.canvasCTX.moveTo(X+this.tile_size, Y);
        this.canvasCTX.lineTo(X, Y+this.tile_size/2);
        this.canvasCTX.lineTo(X+this.tile_size, Y+this.tile_size);
        this.canvasCTX.lineTo(X+this.tile_size, Y);
        this.canvasCTX.closePath();
        this.canvasCTX.fill();

        this.canvasCTX.beginPath();
        this.canvasCTX.roundRect(X+this.tile_size, Y, W_Tiles*this.tile_size, H_Tiles*this.tile_size, [0, this.tile_size, this.tile_size, this.tile_size]);
        this.canvasCTX.fill();

        this.canvasCTX.restore();
    }

    draw_bubble_base_right(X, Y, W_Tiles, H_Tiles) {
        // Arrow
        this.canvasCTX.save();
        this.canvasCTX.fillStyle = colors.overlay;

        this.canvasCTX.beginPath();
        this.canvasCTX.moveTo(X+W_Tiles*this.tile_size, Y);
        this.canvasCTX.lineTo(X+(W_Tiles+1)*this.tile_size, Y+this.tile_size/2);
        this.canvasCTX.lineTo(X+W_Tiles*this.tile_size, Y+this.tile_size);
        this.canvasCTX.lineTo(X+W_Tiles*this.tile_size, Y);
        this.canvasCTX.closePath();
        this.canvasCTX.fill();

        this.canvasCTX.roundRect(X, Y, W_Tiles*this.tile_size, H_Tiles*this.tile_size, [this.tile_size, 0, this.tile_size, this.tile_size]);
        this.canvasCTX.fill();
        
        this.canvasCTX.restore();
    }

    draw_bubble_left(Y, text,  max_text_tiles=23, icon_color) {
        this.canvasCTX.save();
        let needed_space = drawString(this.dummy_canvasCTX, text, 0, 0, 1, max_text_tiles*this.tile_size)
        let W_Tiles = Math.floor(needed_space[0]/this.tile_size) + 2
        let H_Tiles = Math.floor(needed_space[1]/this.tile_size) + 1

        let X = 13*this.tile_size


        this.canvasCTX.beginPath();
        this.canvasCTX.fillStyle = icon_color;
        this.canvasCTX.roundRect(X, Y, 2*this.tile_size, 2*this.tile_size, [this.tile_size/2, this.tile_size/2, this.tile_size/2, this.tile_size/2]);
        this.canvasCTX.fill();

        this.canvasCTX.beginPath();
        this.canvasCTX.strokeStyle = colors.border;
        this.canvasCTX.lineWidth = 1.5
        this.canvasCTX.roundRect(X, Y, 2*this.tile_size, 2*this.tile_size, [this.tile_size/2, this.tile_size/2, this.tile_size/2, this.tile_size/2]);
        this.canvasCTX.stroke();


        this.draw_bubble_base_left(X+2*this.tile_size, Y, W_Tiles, H_Tiles)
        console.log(text);

        drawString(this.canvasCTX, text, X+3.5*this.tile_size, Y+0.5*this.tile_size, 1, max_text_tiles*this.tile_size)
        this.canvasCTX.restore();

        return H_Tiles
    }

    draw_bubble_right(Y, text, max_text_tiles=23, icon_color) {
        this.canvasCTX.save();
        let needed_space = drawString(this.dummy_canvasCTX, text, 0, 0, 1, max_text_tiles*this.tile_size)
                
        let W_Tiles = Math.floor(needed_space[0]/this.tile_size) + 2
        let H_Tiles = Math.floor(needed_space[1]/this.tile_size) + 1
        
        let X = (this.tiles_x - 6 - W_Tiles - 3)*this.tile_size


        this.canvasCTX.beginPath();
        this.canvasCTX.fillStyle = icon_color;
        this.canvasCTX.roundRect(X+(W_Tiles+1)*this.tile_size, Y, 2*this.tile_size, 2*this.tile_size, [this.tile_size/2, this.tile_size/2, this.tile_size/2, this.tile_size/2]);
        this.canvasCTX.fill();
        
        this.canvasCTX.beginPath();
        this.canvasCTX.strokeStyle = colors.border;
        this.canvasCTX.lineWidth = 1.5
        this.canvasCTX.roundRect(X+(W_Tiles+1)*this.tile_size, Y, 2*this.tile_size, 2*this.tile_size, [this.tile_size/2, this.tile_size/2, this.tile_size/2, this.tile_size/2]);
        this.canvasCTX.stroke();

        this.draw_bubble_base_right(X, Y, W_Tiles, H_Tiles)
        console.log(text);
        drawString(this.canvasCTX, text, X+0.5*this.tile_size, Y+0.5*this.tile_size, 1, max_text_tiles*this.tile_size)
        this.canvasCTX.restore();

        return H_Tiles
    }

    // SECTION C - Score + funds

    draw_score(X, Y, game_manager) {
        this.canvasCTX.save();

        drawString(this.canvasCTX, "Score", X+0*this.tile_size, Y+2, 1, 5*this.tile_size)

        this.canvasCTX.beginPath();
        this.canvasCTX.fillStyle = colors.overlay;
        this.canvasCTX.roundRect(X+4*this.tile_size, Y, 6.75*this.tile_size, 1.5*this.tile_size, this.tile_size*0.5);
        this.canvasCTX.fill();

        drawString(this.canvasCTX, game_manager.score.toString(), X+5*this.tile_size, Y+2, 1, 5*this.tile_size)

        this.canvasCTX.restore();
    }

    draw_funds(X, Y, game_manager) {
        this.canvasCTX.save();

        drawString(this.canvasCTX, "Funds", X+0*this.tile_size, Y+2, 1, 5*this.tile_size)



        this.canvasCTX.beginPath();
        this.canvasCTX.fillStyle = colors.battery_red;
        this.canvasCTX.roundRect(X+4*this.tile_size, Y, 6.75*this.tile_size, 1.5*this.tile_size, this.tile_size*0.5);
        this.canvasCTX.fill();

        let fund_fraction = Math.max(game_manager.funds/game_manager.max_funds, 0)

        this.canvasCTX.beginPath();
        this.canvasCTX.fillStyle = colors.battery_green;
        this.canvasCTX.roundRect(X+4*this.tile_size, Y, fund_fraction*6.75*this.tile_size, 1.5*this.tile_size, this.tile_size*0.5);
        this.canvasCTX.fill();

        /*
        this.canvasCTX.beginPath();
        this.canvasCTX.fillStyle = colors.border;
        this.canvasCTX.lineWidth = 2;
        this.canvasCTX.roundRect(X+4*this.tile_size, Y, 6*this.tile_size, 1.5*this.tile_size, this.tile_size*0.5);
        this.canvasCTX.stroke();
        */

        if(fund_fraction == 0) {
            drawString(this.canvasCTX, "No Funds", X+4.5*this.tile_size, Y+2, 1, 7*this.tile_size)
        }



        this.canvasCTX.restore();
    }


    // Section D - Quick Buttons

    draw_dont_know_button(X, Y, button_selected=false) {
        this.canvasCTX.save();

        this.canvasCTX.beginPath();
        this.canvasCTX.fillStyle = colors.overlay;
        if(button_selected) this.canvasCTX.fillStyle = colors.selected_overlay;
        this.canvasCTX.roundRect(X+2*this.tile_size, Y, 3*this.tile_size, 3*this.tile_size, this.tile_size*1);
        this.canvasCTX.fill();


        this.canvasCTX.beginPath();
        this.canvasCTX.fillStyle = colors.border;
        this.canvasCTX.lineWidth = 2;
        this.canvasCTX.roundRect(X+2*this.tile_size, Y, 3*this.tile_size, 3*this.tile_size, this.tile_size*1);
        this.canvasCTX.stroke();


        this.canvasCTX.beginPath();
        this.canvasCTX.strokeStyle = colors.quick_button_red;
        this.draw_line(X+2.75*this.tile_size, Y+0.75*this.tile_size, X+4.25*this.tile_size, Y+2.25*this.tile_size)
        this.draw_line(X+2.75*this.tile_size, Y+2.25*this.tile_size, X+4.25*this.tile_size, Y+0.75*this.tile_size)

        this.canvasCTX.restore();
    }

    // General + Base
    draw_line(x0, y0, x1, y1) {
        this.canvasCTX.beginPath();
        this.canvasCTX.moveTo(x0,y0);
        this.canvasCTX.lineTo(x1,y1);
        this.canvasCTX.closePath();
        this.canvasCTX.stroke();
    }

    draw_base() {
        // Canvas width/height hardcoded to 960/540
        this.canvasCTX.clearRect(0, 0, this.width, this.height)

        this.canvasCTX.fillStyle = colors.background_shaded;
        this.canvasCTX.fillRect(this.border_size, this.border_size, this.width, this.height);
    

        this.canvasCTX.fillStyle = colors.base;
        this.canvasCTX.fillRect(0, 0, this.width-this.border_size, this.height-this.border_size);


        // Outer border
        this.canvasCTX.strokeStyle = colors.border
        this.canvasCTX.lineWidth = this.border_size;
        this.canvasCTX.beginPath();
        this.canvasCTX.rect(this.border_size/2, this.border_size/2, this.width-this.border_size*2, this.height-this.border_size*2)
        this.canvasCTX.stroke();

        this.draw_line(12*this.tile_size, 0, 12*this.tile_size, this.height-this.border_size)
        this.draw_line(0, 21*this.tile_size, 12*this.tile_size, 21*this.tile_size)
        this.draw_line(43*this.tile_size, 0, 43*this.tile_size, this.height-this.border_size)

      
    }


    pos_in_area(posX, posY, x0, y0, W, H){
        return posX >= x0 && posX <= x0+W && posY >= y0 && posY <= y0+H
    }



}



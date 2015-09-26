module.exports = {
    socket : {
        events : {
            // client will emit these
            NEW_GAME    : "ng",
            GET_BOARD   : "gb",
            
            // server will emit these
            GAME_ID     : "gi",
            BOARD_DATA  : "bd",
        }
    },
    game : {
        status : {
            STARTED     : 0,
        },
        turn : {
            P1          : 1,
            p2          : 2,
        },
        board : {
            occupants : {
                EMPTY       : 0,
                P1          : 1,
                P2          : 2,
                P1K         : 3,
                P2K         : 4
            },
        },
    }
};

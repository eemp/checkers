module.exports = {
    socket : {
        events : {
            // client will emit these
            NEW_GAME    : "ng",
            GET_BOARD   : "gb",
            GET_MOVES   : "gm",
            MAKE_MOVE   : "mm",

            // server will emit these
            GAME_ID     : "gi",
            BOARD_DATA  : "bd",
            AVAIL_MOVES : "am",
        }
    },
    game : {
        status : {
            STARTED     : 0,
        },
        turn : {
            P1          : 1,
            P2          : 2,
        },
        board : {
            occupants : {
                EMPTY   : 0,
                P1      : 1,
                P2      : 2,
                P1K     : 3,
                P2K     : 4
            },
            directions : {
                NE      : 1,
                SE      : 2,
                SW      : 3,
                NW      : 4
            }
        },
    }
};

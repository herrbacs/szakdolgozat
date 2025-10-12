def level_0():
    return {
        "walls": [
           {
                "id": "bc654ebc-1c6b-4355-8aec-01f12ab39fad",
                "color": "0x1099bb",
                "exit": {
                    "state": "CLOSED",
                    "keeyId": "faafcf2d-2bca-4706-86ec-74c2aa98e000",
                    "sprites": [
                        {
                            "state": "CLOSED",
                            "name": "exit_closed.png",
                            "dimension": {
                                "width": "350",
                                "height": "500"
                            }
                        },
                        {
                            "state": "OPEN",
                            "name": "exit_opened.png",
                            "dimension": {
                                "width": "350",
                                "height": "500"
                            }
                        }
                    ]
                },
                "pickables": [
                    {
                        "id": "faafcf2d-2bca-4706-86ec-74c2aa98e000",
                        "position": "FT2",
                        "name": "Exit Key",
                        "sprite": {
                            "dimension": {
                                "width": "199",
                                "height": "471",
                            },
                            "name": "exit_key.png"
                        },
                        "reusable": "false",
                    }
                ],
                "inspectables": [],
                "interactables": [],
            },
            {
                "id": "e4843042-0ca9-4e03-b45e-c860b56b390a",
                "color": "0xffc300",
                "pickables": [],
                "inspectables": [
                    {
                        "id": "4558d2bb-8af1-4d38-9b64-cdefe6031cf9",
                        "position": "WT1",
                        "text": "The time is 14:30",
                        "type": "CLOCK",
                        "sprites": [
                            {
                                "state": "DEFAULT",
                                "name": "clock.png",
                                "dimension": {
                                    "width": "327",
                                    "height": "326"
                                },
                                "perspective": {
                                    "right": {
                                        "state": "DEFAULT",
                                        "name": "clock_right_perspective.png",
                                        "dimension": {
                                            "width": "327",
                                            "height": "326"
                                        },
                                    },
                                    "left": {
                                        "state": "DEFAULT",
                                        "name": "clock_left_perspective.png",
                                        "dimension": {
                                            "width": "327",
                                            "height": "326"
                                        },
                                    },
                                },
                            }
                        ]
                    }
                ],
                "interactables": [],
            },
            {
                "id": "3f3c2958-bbe7-448a-b58c-98385540f5b1",
                "color": "0xff5733",
                "pickables": [],
                "inspectables": [],
                "interactables": [
                    {
                        "id": "f39e0a22-6742-46dc-8623-b782cb6729ee",
                        "position": "W1",
                        "type": "PAINTING",
                        "holds": {
                            "pickable" : None,
                            "inspectable" : {
                                "id": "4558d2bb-8af1-4d38-9b64-cdefe6031cf9",
                                "position": "W1",
                                "text": "The time is 14:30",
                                "type": "CLOCK",
                                "sprites": [
                                    {
                                        "state": "DEFAULT",
                                        "name": "painting.png",
                                        "dimension": {
                                            "width": "327",
                                            "height": "326"
                                        },
                                        "perspective": {
                                            "right": {
                                                "state": "DEFAULT",
                                                "name": "painting_right_perspective.png",
                                                "dimension": {
                                                    "width": "327",
                                                    "height": "326"
                                                },
                                            },
                                            "left": {
                                                "state": "DEFAULT",
                                                "name": "painting_left_perspective.png",
                                                "dimension": {
                                                    "width": "327",
                                                    "height": "326"
                                                },
                                            },
                                        },
                                    }
                                ]
                            },
                        },
                        "sprites": [
                            {
                                "state": "DEFAULT",
                                "name": "painting.png",
                                "dimension": {
                                    "width": "1024",
                                    "height": "1792"
                                },
                                "perspective": {
                                    "right": {
                                        "state": "DEFAULT",
                                        "name": "painting_right_perspective.png",
                                        "dimension": {
                                            "width": "1024",
                                            "height": "1792"
                                        },
                                    },
                                    "left": {
                                        "state": "DEFAULT",
                                        "name": "painting_left_perspective.png",
                                        "dimension": {
                                            "width": "1024",
                                            "height": "1792"
                                        },
                                    },
                                },
                            }
                        ]
                    },
                ],
            },
            {
                "id": "85d55920-9bd1-45f8-ac9d-bc413db42f8e",
                "color": "0x581845",
                "pickables": [],
                "inspectables": [],
                "interactables": [],
            }
        ]
    }

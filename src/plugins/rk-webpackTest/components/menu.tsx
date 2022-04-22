//@ts-nocheck fuck fuck shit shit bitch fuck i'll fix it later i swear

import { ContextMenu } from "@rikka/API/components";
import React from "@rikka/API/pkg/React";

export const menu = <>
    <ContextMenu.Separator/>
    <ContextMenu.Group>
        <ContextMenu.Item
            label={"sus among us"}
            id="test-menu"
            action={async () => {
                console.log("hiihihihihihi");
            }}
        />
    </ContextMenu.Group>
</>

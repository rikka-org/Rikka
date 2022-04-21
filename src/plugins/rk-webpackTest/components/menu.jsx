import { ContextMenu } from "@rikka/API/components";

export default menu = <>
    <ContextMenu.Separator />
    <ContextMenu.Group>
        <ContextMenu.Item
            label={`sus amogos`}
            id="addon-installer"
            action={async () => {
                console.log("hiihihihihihi");
            }}
        />
    </ContextMenu.Group>
</>
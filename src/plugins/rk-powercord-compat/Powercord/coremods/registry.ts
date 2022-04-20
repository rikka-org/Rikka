const pc_mods_path = "../../powercord-git/src/Powercord/coremods"

export = [
    require(`${pc_mods_path}/no-track`),
    require(`${pc_mods_path}/router`),
    require(`${pc_mods_path}/dev-lands`),
    require(`${pc_mods_path}/store`),
    require(`${pc_mods_path}/badges`),
    require(`${pc_mods_path}/utility-classes`),
    require(`${pc_mods_path}/react-devtools`),
]

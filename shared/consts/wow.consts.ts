import { WoWRole } from '@shared/types/types'
import {
    wowArmorTypeSchema,
    wowClassSchema,
    wowItemSlotKeySchema,
    wowItemSlotSchema,
    wowItemTerziaryStatsSchema,
    wowRaidDiffSchema,
    wowRoleClassSchema,
    wowRolesSchema
} from '../schemas/wow.schemas'

export const CURRENT_RAID_ID = 1273 // Nerubar palace

export const CLASSES = wowClassSchema.options
export const ROLES = wowRolesSchema.options
export const RAID_DIFF = wowRaidDiffSchema.options

export const ROLES_CLASSES_MAP = {
    Tank: wowRoleClassSchema.shape.Tank.options,
    Healer: wowRoleClassSchema.shape.Healer.options,
    DPS: wowRoleClassSchema.shape.DPS.options
}

export const TERZIARY_STATS = wowItemTerziaryStatsSchema.options
export const ARMOR_TYPES = wowArmorTypeSchema.options
export const ITEM_SLOTS = wowItemSlotSchema.options
export const ITEM_SLOTS_KEY = wowItemSlotKeySchema.options

export const PROFESSION_TYPES = new Set([
    'Alchemy',
    'Blacksmithing',
    'Enchanting',
    'Engineering',
    'Herbalism',
    'Inscription',
    'Jewelcrafting',
    'Leatherworking',
    'Mining',
    'Skinning',
    'Tailoring',
    'Cooking'
])

export const ROLE_PRIORITIES: Record<WoWRole, number> = {
    Tank: 0,
    Healer: 1,
    DPS: 2
} as const

export const REALMS = {
    EU: [
        { name: 'Aegwynn', slug: 'aegwynn' },
        { name: 'Aerie Peak', slug: 'aerie-peak' },
        { name: 'Agamaggan', slug: 'agamaggan' },
        { name: 'Aggra (Português)', slug: 'aggra-português' },
        { name: 'Aggramar', slug: 'aggramar' },
        { name: "Ahn'Qiraj", slug: 'ahnqiraj' },
        { name: "Al'Akir", slug: 'alakir' },
        { name: 'Alexstrasza', slug: 'alexstrasza' },
        { name: 'Alleria', slug: 'alleria' },
        { name: 'Alonsus', slug: 'alonsus' },
        { name: "Aman'Thul", slug: 'amanthul' },
        { name: 'Ambossar', slug: 'ambossar' },
        { name: 'Anachronos', slug: 'anachronos' },
        { name: 'Anetheron', slug: 'anetheron' },
        { name: 'Antonidas', slug: 'antonidas' },
        { name: "Anub'arak", slug: 'anubarak' },
        { name: 'Arak-arahm', slug: 'arakarahm' },
        { name: 'Arathi', slug: 'arathi' },
        { name: 'Arathor', slug: 'arathor' },
        { name: 'Archimonde', slug: 'archimonde' },
        { name: 'Area 52', slug: 'area-52' },
        { name: 'Argent Dawn', slug: 'argent-dawn' },
        { name: 'Arthas', slug: 'arthas' },
        { name: 'Arygos', slug: 'arygos' },
        { name: 'Aszune', slug: 'aszune' },
        { name: 'Auchindoun', slug: 'auchindoun' },
        { name: 'Azjol-Nerub', slug: 'azjolnerub' },
        { name: 'Azshara', slug: 'azshara' },
        { name: 'Azuremyst', slug: 'azuremyst' },
        { name: 'Baelgun', slug: 'baelgun' },
        { name: 'Balnazzar', slug: 'balnazzar' },
        { name: 'Blackhand', slug: 'blackhand' },
        { name: 'Blackmoore', slug: 'blackmoore' },
        { name: 'Blackrock', slug: 'blackrock' },
        { name: "Blade's Edge", slug: 'blades-edge' },
        { name: 'Bladefist', slug: 'bladefist' },
        { name: 'Bloodfeather', slug: 'bloodfeather' },
        { name: 'Bloodhoof', slug: 'bloodhoof' },
        { name: 'Bloodscalp', slug: 'bloodscalp' },
        { name: 'Blutkessel', slug: 'blutkessel' },
        { name: 'Boulderfist', slug: 'boulderfist' },
        { name: 'Bronze Dragonflight', slug: 'bronze-dragonflight' },
        { name: 'Bronzebeard', slug: 'bronzebeard' },
        { name: 'Burning Blade', slug: 'burning-blade' },
        { name: 'Burning Legion', slug: 'burning-legion' },
        { name: 'Burning Steppes', slug: 'burning-steppes' },
        { name: "C'Thun", slug: 'cthun' },
        { name: 'Chamber of Aspects', slug: 'chamber-of-aspects' },
        { name: 'Chants éternels', slug: 'chants-éternels' },
        { name: "Cho'gall", slug: 'chogall' },
        { name: 'Chromaggus', slug: 'chromaggus' },
        { name: 'Confrérie du Thorium', slug: 'confrérie-du-thorium' },
        { name: 'Conseil des Ombres', slug: 'conseil-des-ombres' },
        { name: 'Crushridge', slug: 'crushridge' },
        { name: 'Culte de la Rive noire', slug: 'culte-de-la-rive-noire' },
        { name: 'Daggerspine', slug: 'daggerspine' },
        { name: 'Dalaran', slug: 'dalaran' },
        { name: 'Dalvengyr', slug: 'dalvengyr' },
        { name: 'Darkmoon Faire', slug: 'darkmoon-faire' },
        { name: 'Darksorrow', slug: 'darksorrow' },
        { name: 'Darkspear', slug: 'darkspear' },
        { name: 'Das Konsortium', slug: 'das-konsortium' },
        { name: 'Das Syndikat', slug: 'das-syndikat' },
        { name: 'Deathwing', slug: 'deathwing' },
        { name: 'Defias Brotherhood', slug: 'defias-brotherhood' },
        { name: 'Dentarg', slug: 'dentarg' },
        { name: 'Der abyssische Rat', slug: 'der-abyssische-rat' },
        { name: 'Der Mithrilorden', slug: 'der-mithrilorden' },
        { name: 'Der Rat von Dalaran', slug: 'der-rat-von-dalaran' },
        { name: 'Destromath', slug: 'destromath' },
        { name: 'Dethecus', slug: 'dethecus' },
        { name: 'Die Aldor', slug: 'die-aldor' },
        { name: 'Die Arguswacht', slug: 'die-arguswacht' },
        { name: 'Die ewige Wacht', slug: 'die-ewige-wacht' },
        { name: 'Die Nachtwache', slug: 'die-nachtwache' },
        { name: 'Die Silberne Hand', slug: 'die-silberne-hand' },
        { name: 'Die Todeskrallen', slug: 'die-todeskrallen' },
        { name: 'Doomhammer', slug: 'doomhammer' },
        { name: 'Draenor', slug: 'draenor' },
        { name: 'Dragonblight', slug: 'dragonblight' },
        { name: 'Dragonmaw', slug: 'dragonmaw' },
        { name: "Drak'thul", slug: 'drakthul' },
        { name: "Drek'Thar", slug: 'drekthar' },
        { name: 'Dun Modr', slug: 'dun-modr' },
        { name: 'Dun Morogh', slug: 'dun-morogh' },
        { name: 'Dunemaul', slug: 'dunemaul' },
        { name: 'Durotan', slug: 'durotan' },
        { name: 'Earthen Ring', slug: 'earthen-ring' },
        { name: 'Echsenkessel', slug: 'echsenkessel' },
        { name: 'Eitrigg', slug: 'eitrigg' },
        { name: "Eldre'Thalas", slug: 'eldrethalas' },
        { name: 'Elune', slug: 'elune' },
        { name: 'Emerald Dream', slug: 'emerald-dream' },
        { name: 'Emeriss', slug: 'emeriss' },
        { name: 'Eonar', slug: 'eonar' },
        { name: 'Eredar', slug: 'eredar' },
        { name: 'Executus', slug: 'executus' },
        { name: 'Exodar', slug: 'exodar' },
        { name: 'Festung der Stürme', slug: 'festung-der-stürme' },
        { name: 'Forscherliga', slug: 'forscherliga' },
        { name: 'Frostmane', slug: 'frostmane' },
        { name: 'Frostmourne', slug: 'frostmourne' },
        { name: 'Frostwhisper', slug: 'frostwhisper' },
        { name: 'Frostwolf', slug: 'frostwolf' },
        { name: 'Garona', slug: 'garona' },
        { name: 'Garrosh', slug: 'garrosh' },
        { name: 'Genjuros', slug: 'genjuros' },
        { name: 'Ghostlands', slug: 'ghostlands' },
        { name: 'Gilneas', slug: 'gilneas' },
        { name: 'Gorgonnash', slug: 'gorgonnash' },
        { name: 'Grim Batol', slug: 'grim-batol' },
        { name: "Gul'dan", slug: 'guldan' },
        { name: 'Hakkar', slug: 'hakkar' },
        { name: 'Haomarush', slug: 'haomarush' },
        { name: 'Hellfire', slug: 'hellfire' },
        { name: 'Hellscream', slug: 'hellscream' },
        { name: 'Hyjal', slug: 'hyjal' },
        { name: 'Illidan', slug: 'illidan' },
        { name: 'Jaedenar', slug: 'jaedenar' },
        { name: "Kael'thas", slug: 'kaelthas' },
        { name: 'Karazhan', slug: 'karazhan' },
        { name: 'Kargath', slug: 'kargath' },
        { name: 'Kazzak', slug: 'kazzak' },
        { name: "Kel'Thuzad", slug: 'kelthuzad' },
        { name: 'Khadgar', slug: 'khadgar' },
        { name: 'Khaz Modan', slug: 'khaz-modan' },
        { name: "Khaz'goroth", slug: 'khazgoroth' },
        { name: "Kil'jaeden", slug: 'kiljaeden' },
        { name: 'Kilrogg', slug: 'kilrogg' },
        { name: 'Kirin Tor', slug: 'kirin-tor' },
        { name: "Kor'gall", slug: 'korgall' },
        { name: "Krag'jin", slug: 'kragjin' },
        { name: 'Krasus', slug: 'krasus' },
        { name: 'Kul Tiras', slug: 'kul-tiras' },
        { name: 'Kult der Verdammten', slug: 'kult-der-verdammten' },
        { name: 'La Croisade écarlate', slug: 'la-croisade-écarlate' },
        { name: 'Laughing Skull', slug: 'laughing-skull' },
        { name: 'Les Clairvoyants', slug: 'les-clairvoyants' },
        { name: 'Les Sentinelles', slug: 'les-sentinelles' },
        { name: 'Lightbringer', slug: 'lightbringer' },
        { name: "Lightning's Blade", slug: 'lightnings-blade' },
        { name: 'Lordaeron', slug: 'lordaeron' },
        { name: 'Los Errantes', slug: 'los-errantes' },
        { name: 'Lothar', slug: 'lothar' },
        { name: 'Madmortem', slug: 'madmortem' },
        { name: 'Magtheridon', slug: 'magtheridon' },
        { name: "Mal'Ganis", slug: 'malganis' },
        { name: 'Malfurion', slug: 'malfurion' },
        { name: 'Malorne', slug: 'malorne' },
        { name: 'Malygos', slug: 'malygos' },
        { name: 'Mannoroth', slug: 'mannoroth' },
        { name: 'Marécage de Zangar', slug: 'marécage-de-zangar' },
        { name: 'Mazrigos', slug: 'mazrigos' },
        { name: 'Medivh', slug: 'medivh' },
        { name: 'Minahonda', slug: 'minahonda' },
        { name: 'Moonglade', slug: 'moonglade' },
        { name: "Mug'thol", slug: 'mugthol' },
        { name: 'Nagrand', slug: 'nagrand' },
        { name: 'Nathrezim', slug: 'nathrezim' },
        { name: 'Naxxramas', slug: 'naxxramas' },
        { name: 'Nazjatar', slug: 'nazjatar' },
        { name: 'Nefarian', slug: 'nefarian' },
        { name: 'Nemesis', slug: 'nemesis' },
        { name: 'Neptulon', slug: 'neptulon' },
        { name: "Ner'zhul", slug: 'nerzhul' },
        { name: "Nera'thor", slug: 'nerathor' },
        { name: 'Nethersturm', slug: 'nethersturm' },
        { name: 'Nordrassil', slug: 'nordrassil' },
        { name: 'Norgannon', slug: 'norgannon' },
        { name: 'Nozdormu', slug: 'nozdormu' },
        { name: 'Onyxia', slug: 'onyxia' },
        { name: 'Outland', slug: 'outland' },
        { name: 'Perenolde', slug: 'perenolde' },
        { name: "Pozzo dell'Eternità", slug: 'pozzo-delleternità' },
        { name: 'Proudmoore', slug: 'proudmoore' },
        { name: "Quel'Thalas", slug: 'quelthalas' },
        { name: 'Ragnaros', slug: 'ragnaros' },
        { name: 'Rajaxx', slug: 'rajaxx' },
        { name: 'Rashgarroth', slug: 'rashgarroth' },
        { name: 'Ravencrest', slug: 'ravencrest' },
        { name: 'Ravenholdt', slug: 'ravenholdt' },
        { name: 'Rexxar', slug: 'rexxar' },
        { name: 'Runetotem', slug: 'runetotem' },
        { name: 'Sanguino', slug: 'sanguino' },
        { name: 'Sargeras', slug: 'sargeras' },
        { name: 'Saurfang', slug: 'saurfang' },
        { name: 'Scarshield Legion', slug: 'scarshield-legion' },
        { name: "Sen'jin", slug: 'senjin' },
        { name: 'Shadowsong', slug: 'shadowsong' },
        { name: 'Shattered Halls', slug: 'shattered-halls' },
        { name: 'Shattered Hand', slug: 'shattered-hand' },
        { name: 'Shattrath', slug: 'shattrath' },
        { name: "Shen'dralar", slug: 'shendralar' },
        { name: 'Silvermoon', slug: 'silvermoon' },
        { name: 'Sinstralis', slug: 'sinstralis' },
        { name: 'Skullcrusher', slug: 'skullcrusher' },
        { name: 'Spinebreaker', slug: 'spinebreaker' },
        { name: 'Spirestone', slug: 'colinas-pardas' },
        { name: 'Sporeggar', slug: 'sporeggar' },
        { name: 'Steamwheedle Cartel', slug: 'steamwheedle-cartel' },
        { name: 'Stormrage', slug: 'stormrage' },
        { name: 'Stormreaver', slug: 'stormreaver' },
        { name: 'Stormscale', slug: 'stormscale' },
        { name: 'Sunstrider', slug: 'sunstrider' },
        { name: 'Suramar', slug: 'suramar' },
        { name: 'Sylvanas', slug: 'sylvanas' },
        { name: 'Taerar', slug: 'taerar' },
        { name: 'Talnivarr', slug: 'talnivarr' },
        { name: 'Tarren Mill', slug: 'tarren-mill' },
        { name: 'Teldrassil', slug: 'teldrassil' },
        { name: 'Temple noir', slug: 'temple-noir' },
        { name: 'Terenas', slug: 'terenas' },
        { name: 'Terokkar', slug: 'terokkar' },
        { name: 'Terrordar', slug: 'terrordar' },
        { name: 'The Maelstrom', slug: 'the-maelstrom' },
        { name: "The Sha'tar", slug: 'the-shatar' },
        { name: 'The Venture Co', slug: 'the-venture-co' },
        { name: 'Theradras', slug: 'theradras' },
        { name: 'Thrall', slug: 'thrall' },
        { name: "Throk'Feroth", slug: 'throkferoth' },
        { name: 'Thunderhorn', slug: 'thunderhorn' },
        { name: 'Tichondrius', slug: 'tichondrius' },
        { name: 'Tirion', slug: 'tirion' },
        { name: 'Todeswache', slug: 'todeswache' },
        { name: 'Trollbane', slug: 'trollbane' },
        { name: 'Turalyon', slug: 'turalyon' },
        { name: "Twilight's Hammer", slug: 'twilights-hammer' },
        { name: 'Twisting Nether', slug: 'twisting-nether' },
        { name: 'Tyrande', slug: 'tyrande' },
        { name: 'Uldaman', slug: 'uldaman' },
        { name: 'Ulduar', slug: 'ulduar' },
        { name: 'Uldum', slug: 'uldum' },
        { name: "Un'Goro", slug: 'ungoro' },
        { name: 'Varimathras', slug: 'varimathras' },
        { name: 'Vashj', slug: 'vashj' },
        { name: "Vek'lor", slug: 'veklor' },
        { name: "Vek'nilash", slug: 'veknilash' },
        { name: "Vol'jin", slug: 'voljin' },
        { name: 'Wildhammer', slug: 'wildhammer' },
        { name: 'Wrathbringer', slug: 'wrathbringer' },
        { name: 'Xavius', slug: 'xavius' },
        { name: 'Ysera', slug: 'ysera' },
        { name: 'Ysondre', slug: 'ysondre' },
        { name: 'Zenedar', slug: 'zenedar' },
        { name: 'Zirkel des Cenarius', slug: 'zirkel-des-cenarius' },
        { name: "Zul'jin", slug: 'zuljin' },
        { name: 'Zuluhed', slug: 'zuluhed' },
        { name: 'Азурегос', slug: 'azuregos' },
        { name: 'Борейская тундра', slug: 'borean-tundra' },
        { name: 'Вечная Песня', slug: 'eversong' },
        { name: 'Галакронд', slug: 'galakrond' },
        { name: 'Голдринн', slug: 'goldrinn' },
        { name: 'Гордунни', slug: 'gordunni' },
        { name: 'Гром', slug: 'grom' },
        { name: 'Дракономор', slug: 'fordragon' },
        { name: 'Король-лич', slug: 'lich-king' },
        { name: 'Пиратская Бухта', slug: 'booty-bay' },
        { name: 'Подземье', slug: 'deepholm' },
        { name: 'Разувий', slug: 'razuvious' },
        { name: 'Ревущий фьорд', slug: 'howling-fjord' },
        { name: 'Свежеватель Душ', slug: 'soulflayer' },
        { name: 'Седогрив', slug: 'greymane' },
        { name: 'Страж Смерти', slug: 'deathguard' },
        { name: 'Термоштепсель', slug: 'thermaplugg' },
        { name: 'Ткач Смерти', slug: 'deathweaver' },
        { name: 'Черный Шрам', slug: 'blackscar' },
        { name: 'Ясеневый лес', slug: 'ashenvale' }
    ]
}

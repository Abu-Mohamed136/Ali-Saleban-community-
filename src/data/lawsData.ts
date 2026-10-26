import { VillageLawArticle, LawFeedback, UploadedDocument } from '../types';

export const INITIAL_VILLAGE_LAWS: VillageLawArticle[] = [
  {
    id: 'law-001',
    articleNumber: 1,
    titleSo: 'Qodobka 1aad: Lahaanshaha Dhulka & Xeerka Qoondeynta Boosaska',
    titleEn: 'Article 1: Land Ownership & Plot Demarcation Regulations',
    category: 'Land & Plots',
    summarySo: 'Boosaska deegaanka Kulmis waa 20m x 20m. Dhulka lama iibin karo shirkado ganacsi oo dibadda ah odayaasha iyo guddiga la’aantood.',
    summaryEn: 'Residential plots are standardized at 20m x 20m. Land cannot be sold to non-community speculators without Elder Council & Committee seal.',
    fullTextSo: `1. Cabirka rasmiga ah ee hal boos oo deegaan ah (Residential Plot) waa labaatan mitir dherer iyo labaatan mitir ballac (20m x 20m).
2. Xubin kasta oo diiwaangashan oo bixisa tabarucaadka buuxa waxay xaq u leedahay hal boos oo rasmi ah iyo shahaadada lahaanshaha (Cali Saleebaan Cadastre Certificate).
3. Dhulka Tuulada Kulmis waa hanti wadaag u dhaxaysa reerka, looma ogola in laga iibiyo dilaaliin ama ganacsato shisheeye ah iyadoon la helin oggolaansho qoraal ah oo ka timid Golaha Odayaasha iyo Guddiga Farsamada.
4. Qofkii booskiisa muddo 12 bilood ah aan wax dhismo ama ood ah ka samayn, guddigu wuxuu xaq u leeyahay inuu ku wargeliyo dib u qiimayn.`,
    fullTextEn: `1. The official standard dimension of a residential plot in Kulmis Village is twenty by twenty meters (20m x 20m).
2. Each registered member who fulfills their required contribution holds certified right to one plot and an official ownership certificate issued by the Committee.
3. Kulmis land is communal heritage. It strictly cannot be liquidated or sold to external speculative brokers without unanimous written clearance from the Elder Assembly and Committee.
4. Any plot left undeveloped or unfenced for over 12 months will be subject to committee inquiry and development reminder.`,
    dateAdopted: '2025-01-15',
    status: 'Ratified by Elders',
    supportCount: 148,
    amendCount: 12,
    disagreeCount: 2,
  },
  {
    id: 'law-002',
    articleNumber: 2,
    titleSo: 'Qodobka 2aad: Xuquuqda Biyaha Ceelasha & Dayactirka Matoorada',
    titleEn: 'Article 2: Water Rights, Solar Boreholes & Maintenance Levies',
    category: 'Water & Utilities',
    summarySo: 'Biyaha ceelka cadceedda ku shaqeeya waa xaq qoys kasta u furan. Waxaa jiri doona khidmad yar oo lagu dayactiro tuubooyinka iyo matoorka.',
    summaryEn: 'Clean water from the solar borehole is a fundamental right for every household. A minimal maintenance levy funds solar pump & pipe repairs.',
    fullTextSo: `1. Ceelka biyaha macaanka ee cadceedda ku shaqeeya (Solar Borehole) ee laga qoday Kulmis wuxuu u adeegayaa dhammaan qoysaska deegaanka, xarumaha caafimaadka, iyo dugsiga.
2. Biyaha cabbitaanka qoysaska waa bilaash heerka aasaasiga ah.
3. Xoolaha lagu waraabiyo barkadaha waxaa laga qaadayaa khidmad dayactir ah oo bishii ah ($2 - $5) si loo ilaaliyo nadaafadda iyo beddelka batariyada cadceedda.
4. Cid kasta oo waxyeello u geysata dhuumaha ama tuubooyinka biyaha waxay bixinaysaa ganaax iyo qiimaha dayactirka oo labanlaab ah.`,
    fullTextEn: `1. The solar-powered borehole drilled at Kulmis Village serves all resident families, the public health post, and the primary school.
2. Household domestic drinking water is free of charge at primary baseline access points.
3. Commercial or bulk livestock watering troughs carry a modest monthly upkeep levy ($2 - $5) strictly ring-fenced for solar battery replacement and filter changes.
4. Anyone damaging municipal water pipes or solar pump fittings shall be liable for full restoration costs plus an elder council fine.`,
    dateAdopted: '2025-02-10',
    status: 'Ratified by Elders',
    supportCount: 164,
    amendCount: 4,
    disagreeCount: 0,
  },
  {
    id: 'law-003',
    articleNumber: 3,
    titleSo: 'Qodobka 3aad: Dhawridda Deegaanka, Mamnuucidda Dhuxusha & Geedaha Qunsolka',
    titleEn: 'Article 3: Environmental Protection, Anti-Charcoal Ban & Green Belt',
    category: 'Environment & Trees',
    summarySo: 'Waa mamnuuc in geed nool laga gooyo Kulmis ama dhuxul laga shido. Qoys kasta waxaa lagu dhiirigelinayaa inuu beero laba geed.',
    summaryEn: 'Strict prohibition on cutting live acacia trees or burning charcoal within 5km radius. Every home is encouraged to plant two indigenous trees.',
    fullTextSo: `1. Deegaanka Kulmis waa meel dabiici ah oo la doonayo in lagu ilaaliyo geedaha qodaxda leh, tiinka, iyo caleenta cagaaran ee xooluhu daaqaan.
2. Waxaa gabi ahaanba reebban in dhuxul laga gubo xadka deegaanka Kulmis ilaa masaafad dhan 5km. Qofkii lagu qabto waxaa lagala wareegayaa dhuxusha iyo gaadiidka.
3. Waa mamnuuc in la jaro geed weyn oo hoos leh oo nool. Haddii dhisme loo baahdo, waa in oggolaansho laga helo guddiga deegaanka.
4. Qoys kasta oo boos qaata waxaa waajib ku ah inuu beero ugu yaraan laba geed oo hadh ama midho leh oo ku habboon cimilada Jubbada Hoose.`,
    fullTextEn: `1. Kulmis is committed to ecological preservation, protecting native acacias and coastal pasture grounds.
2. Commercial tree felling and charcoal production are strictly prohibited within a 5km radius of the village boundary. Transgressors will have charcoal impounded and face penalties.
3. Felling mature shade trees for construction requires prior inspection and permit from the Environmental Sub-committee.
4. Every allocated household is requested to plant at least two indigenous shade or fruit trees suitable for the Lower Juba climate.`,
    dateAdopted: '2025-03-01',
    status: 'Ratified by Elders',
    supportCount: 152,
    amendCount: 8,
    disagreeCount: 1,
  },
  {
    id: 'law-004',
    articleNumber: 4,
    titleSo: 'Qodobka 4aad: Waddooyinka Waaweyn, Jidadka Dhexdhexaadka & Suuqyada',
    titleEn: 'Article 4: Main Road Corridors, Inter-Plot Alleys & Market Zones',
    category: 'Roads & Infrastructure',
    summarySo: 'Waddooyinka waaweyn waa 15 mitir, kuwa xaafadaha waa 10 mitir. Qofna looma oggola inuu waddada ku dhex dhiso xayndaab.',
    summaryEn: 'Main arterial avenues are fixed at 15m minimum width; residential alleys at 10m. Encroachment onto designated roadways is strictly illegal.',
    fullTextSo: `1. Waddooyinka waaweyn ee isku xira Kismaayo, Kulmis, iyo xeebta waa inay leeyihiin ballac aan ka yarayn 15 mitir (15 meters).
2. Waddooyinka xaafadaha dhexdooda ah (Access roads) waa 10 mitir si ay u maraan baabuurta dab-demiska, ambalaaska, iyo gaadiidka biyaha dhaamiya.
3. Qof kasta oo ood ama darbi u soo saara waddada dhexdeeda waxaa laga duminayaa dhismahaas iyadoon wax magdhow ah la siinayn.
4. Suuqa ganacsiga, dukaamada, iyo kawaannada hilibka waxay yeelanayaan aag u gaar ah oo aan carqalad ku noqonayn nolosha xaafadaha deegaanka.`,
    fullTextEn: `1. Main transportation corridors connecting Kismayo, Kulmis Center, and coastal arteries must maintain an unobstructed width of at least 15 meters.
2. Residential neighborhood alleys must measure at least 10 meters wide to allow easy passage for emergency ambulances, fire trucks, and water tankers.
3. Any fence, veranda, or wall built beyond demarcated plot pegs into public corridors will be demolished without indemnity.
4. Commercial markets, butcheries, and kiosks are restricted to designated commercial corridors to prevent neighborhood congestion.`,
    dateAdopted: '2025-03-20',
    status: 'Ratified by Elders',
    supportCount: 159,
    amendCount: 5,
    disagreeCount: 0,
  },
  {
    id: 'law-005',
    articleNumber: 5,
    titleSo: 'Qodobka 5aad: Golaha Garsoorka Odayaasha & Xallinta Khilaafaadka Dhaqanka',
    titleEn: 'Article 5: Elder Arbitration Council & Traditional Dispute Resolution',
    category: 'Justice & Arbitration',
    summarySo: 'Khilaaf kasta oo dhul ama derisnimada la xiriira waxaa marka hore xallinaya 5 oday oo dhex-dhexaad ah ka hor intaan maxkamad loo gudbin.',
    summaryEn: 'All boundary, plot, or neighbor disagreements must first be adjudicated by the 5-Elder Mediation Council before any external litigation.',
    fullTextSo: `1. Waxaa la dhisay Golaha Garsoorka Dhaqanka oo ka kooban 5 oday oo xushmad leh, kuwaas oo loo xilsaaray dhex-dhexaadinta bulshada Kulmis.
2. Khilaaf kasta oo ka yimaada xudduudaha boosaska ama muran deriseed waa in loo gudbiyaa Golaha Odayaasha muddo 7 maalmood gudahood ah.
3. Go’aanka odayaasha ku gaaraan wadar-oggol (Consensus) iyo shareecada Islaamka wuxuu noqonayaa mid kama dambeys ah oo guddigu fuliyo.
4. Lama oggola in muran beeleed ama gacan-ka-hadal laga dhex abuuro deegaanka; qofkii nabadgelyada carqaladeeya waxaa laga saarayaa deegaanka.`,
    fullTextEn: `1. A 5-Elder Customary Mediation Council of reputable clan neutral elders is empowered to adjudicate internal matters.
2. Any boundary overlap, construction dispute, or neighbor grievance must be submitted to the council within 7 days of occurrence.
3. Council rulings based on consensus, local customary law (Xeer), and Islamic jurisprudence carry binding authority executed by the Committee.
4. Violent altercations or incitement to clan discord are strictly unacceptable; violators risk loss of rights and removal from the settlement.`,
    dateAdopted: '2025-04-05',
    status: 'Ratified by Elders',
    supportCount: 161,
    amendCount: 7,
    disagreeCount: 0,
  },
  {
    id: 'law-006',
    articleNumber: 6,
    titleSo: 'Qodobka 6aad: Xuquuqda Xubnaha Qurbo-joogta & Dhowridda Dhaxalka Qoyska',
    titleEn: 'Article 6: Diaspora Protections, Family Inheritance & Title Deeds',
    category: 'Diaspora Rights',
    summarySo: 'Boosaska xubnaha jaaliyadda dibadda ee la diiwaangeliyay waa ammaan, laguma xad-gudbi karo. Dhaxalka waxaa loo fulinayaa shareecada.',
    summaryEn: 'Allocated plots for diaspora contributors in North America, UK, and Europe are securely held; inheritance transfers follow certified deeds.',
    fullTextSo: `1. Xubnaha Cali Saleebaan ee ku nool qurba-joogta (USA, UK, Yurub, Khaliijka, Kiinya) ee bixiya lacagta booska waxay leeyihiin xuquuq la mid ah kuwa jooga Kismaayo.
2. Boosaska qurbo-joogta waxaa lagu qorayaa lambarka aqoonsiga rasmiga ah (CSK-ID) iyo warqad caddeyn ah oo lagu kaydinayo xogta elektaroonigga ah ee app-ka.
3. Qofna kuma tagri-fali karo, mana sheegan karo boos uu leeyahay qof dibadda jooga isagoo ku andacoonaya maqnaanshihiisa.
4. Haddii xubin dhimato, lahaanshaha booska wuxuu si toos ah ugu wareegayaa carruurtiisa ama dhaxalkiisa sharciga ah sida shareecadu jideyso.`,
    fullTextEn: `1. Diaspora members (USA, UK, Europe, Gulf, Kenya) contributing toward Kulmis development retain equal and indefeasible title rights.
2. Diaspora holdings are registered under a distinct cryptographic identifier (CSK-ID) and backed by digital cloud and committee ledger records.
3. No domestic resident may claim or build upon an absent diaspora member's registered plot under any claim of vacancy or neglect.
4. In the event of a member's decease, title rights transfer smoothly to designated heirs pursuant to Islamic inheritance law and certified death certificates.`,
    dateAdopted: '2025-04-18',
    status: 'Ratified by Elders',
    supportCount: 155,
    amendCount: 9,
    disagreeCount: 1,
  },
  {
    id: 'law-007',
    articleNumber: 7,
    titleSo: 'Qodobka 7aad: Hufnaanta Dhaqaalaha, Baadhista Xisaabaadka & Rasiidhada',
    titleEn: 'Article 7: Financial Audit, Transparent Ledger & Receipt Integrity',
    category: 'Finance & Transparency',
    summarySo: 'Doolar kasta oo soo gala guddiga waa inuu leeyahay rasiid elektaroonig ah. Xisaab-xidhka bishaa waxaa loo bandhigayaa xubnaha oo dhan.',
    summaryEn: 'Every single dollar collected must generate an authentic traceable receipt. Monthly income/expenditure statements are audited openly.',
    fullTextSo: `1. Dhammaan lacagaha loo soo diro horumarinta Kulmis (EVC Plus, Zaad, e-Dahab, Bank) waa in lagu xereeyaa akoonada rasmiga ah ee guddiga oo keliya.
2. Qof kasta oo tabarucaad bixiya waxaa isla goobta loogu soo saarayaa Rasiidka Rasmiga ah ee PDF-ka ah oo wata lambarka CSK iyo magaca Adan Deeq (Technical Lead).
3. Qasnajiga iyo Guddiga Xisaabaadka waxay bishii mar soo bandhigayaan warbixin maaliyadeed oo furan oo app-ka iyo shaqada guddiga laga dhex akhrisan karo.
4. Waa mamnuuc in lacagta guddiga loo adeegsado dano gaar ah; cid kasta oo musuqmaasuq lagu helo waxaa laga qaadayaa tallaabo sharci iyo mid dhaqan.`,
    fullTextEn: `1. All funds remitted for Kulmis expansion must be deposited directly into verified multi-signatory committee merchant and banking accounts.
2. Every donor or plot applicant is immediately issued a tamper-proof PDF digital receipt containing official CSK reference numbers.
3. The treasury shall publish monthly audited balancing statements accessible to all committee members via this application.
4. Misappropriation of communal funds will trigger immediate expulsion, public listing on the anti-scam noticeboard, and formal judicial referral.`,
    dateAdopted: '2025-05-02',
    status: 'Ratified by Elders',
    supportCount: 172,
    amendCount: 2,
    disagreeCount: 0,
  },
  {
    id: 'law-008',
    articleNumber: 8,
    titleSo: 'Qodobka 8aad: Amniga Guud, Ilaalada Xaafadaha & Iskaashiga Ciidamada',
    titleEn: 'Article 8: Village Security, Neighborhood Night Watch & Emergency Response',
    category: 'Security & Safety',
    summarySo: 'Amniga Tuulada Kulmis waa mid wada-jir ah. Waxaa la sameeyay ilaalada habeenkii iyo xiriir toos ah oo lala leeyahay ciidamada ammaanka.',
    summaryEn: 'Kulmis security is maintained collaboratively via volunteer night patrols, solar street illumination, and direct liaison with Jubaland security forces.',
    fullTextSo: `1. Tuulada Kulmis waxay dhisaysaa ciidamo ilaalo xaafadeed ah (Community Neighborhood Watch) oo ka shaqeeya ilaalinta hantida iyo nabadda habeenkii.
2. Xubin kasta waxaa ku waajib ah inay wargeliso guddiga ama horumariyaha haddii ay arkaan dhaqdhaqaaq shaki leh ama dad doonaya inay sharci-darro ku qabsadaan dhul.
3. Guddigu wuxuu xiriir maalinle ah la leeyahay saldhigyada booliiska iyo maamulka Kismaayo si loo dammaanad-qaado amniga guud ee deegaanka.
4. Nalalka cadceedda (Solar Streetlights) ee lagu xiro waddooyinka waa hanti guud, qof kasta waxaa ku waajib ah inuu ilaaliyo.`,
    fullTextEn: `1. Kulmis village maintains an integrated community night patrol working alongside Jubaland law enforcement to secure lives and property.
2. Members are obligated to report suspicious trespassers or unauthorized encroachment immediately via the hotline or village liaison.
3. The committee coordinates with local police divisions to uphold civic tranquility and protect development machinery.
4. Installed solar street lighting is protected public infrastructure; vandalism or theft triggers severe tribal fines and legal arrest.`,
    dateAdopted: '2025-05-20',
    status: 'Ratified by Elders',
    supportCount: 168,
    amendCount: 3,
    disagreeCount: 0,
  }
];

export const INITIAL_PUBLIC_FEEDBACK: LawFeedback[] = [
  {
    id: 'fb-001',
    articleId: 'law-001',
    articleNumber: 1,
    authorName: 'Ugaas Maxamuud Cali Shire',
    authorRole: 'Kulmis Elder Council Chairman',
    feedbackType: 'Support',
    title: 'Taageero buuxda oo ku saabsan cabirka 20x20m',
    comment: 'Waxaan si buuxda u taageeraynaa in cabirka boosasku noqdo 20x20m. Waa cabir ku filan guri qoys, beer yar, iyo musqul nadiif ah. Waxaan kaloo adkeynaynaa inaan dhulka loo gacan galin dilaaliin.',
    dateSubmitted: '2025-01-20',
    upvotes: 42,
    status: 'Adopted by Elders',
    officerResponse: 'Guddigu wuxuu u mahadcelinayaa Ugaaska; taladaada waxaa lagu daray xeerka rasmiga ah.'
  },
  {
    id: 'fb-002',
    articleId: 'law-006',
    articleNumber: 6,
    authorName: 'Dr. Faarax Cabdirisaaq (Minneapolis)',
    authorRole: 'Diaspora Committee Liaison (USA)',
    feedbackType: 'Amendment',
    title: 'Soo jeedin: Qiraalka Dhijitaalka ah iyo QR Code Shahaadada',
    comment: 'Jaaliyadda Mareykanka iyo Yurub waxay codsanayaan in shahaadooyinka boosaska loo yeelo QR Code iyo lambar serial ah oo lagu xaqiijin karo online, si qof walba xitaa hadduusan Soomaaliya joogin u helo kalsooni buuxda.',
    dateSubmitted: '2025-04-22',
    upvotes: 38,
    status: 'Adopted by Elders',
    officerResponse: 'Adan Deeq (Developer) wuxuu ku daray rasiidhada iyo shahaadooyinka lambarka CSK-Verify oo hadda ka shaqeynaya qaybta Security Vault.'
  },
  {
    id: 'fb-003',
    articleId: 'law-004',
    articleNumber: 4,
    authorName: 'Eng. Cabdiweli Nuur',
    authorRole: 'Civil & Road Engineer (Technical Team)',
    feedbackType: 'Proposal',
    title: 'Balaarinta Waddooyinka Gaadiidka Xamuulka',
    comment: 'Waddada galaanka dekadda iyo xeebta waa in loo daayo meel baabuurta culus ee qalabka dhismaha sida ciidda iyo shubka ay u maraan iyagoon dumin tubbooyinka biyaha.',
    dateSubmitted: '2025-03-25',
    upvotes: 29,
    status: 'Adopted by Elders',
    officerResponse: 'Waxaa loo qoondeeyay 20m waddada xamuulka ee maraysa daafaca bari.'
  },
  {
    id: 'fb-004',
    articleId: 'law-002',
    articleNumber: 2,
    authorName: 'Hooyo Xaliimo Cismaan Warsame',
    authorRole: 'Women & Family Representative',
    feedbackType: 'Proposal',
    title: 'Ilaalinta Goobta Biyaha Haweenka iyo Carruurta',
    comment: 'Fadlan ceelka biyaha ha laga dhex sameeyo meel u gaar ah haweenka oo kuraas iyo hadh leh, si aysan u la safan xoolaha dhaadheer.',
    dateSubmitted: '2025-02-15',
    upvotes: 35,
    status: 'Adopted by Elders',
    officerResponse: 'Waxaa qorshaha lagu daray tubbooyinka guriga iyo barxad hadh leh oo 50m u jirta ceelka xoolaha.'
  }
];

export const INITIAL_UPLOADED_DOCUMENTS: UploadedDocument[] = [
  {
    id: 'doc-001',
    title: 'Kulmis Village Master Cadastre & Expansion Plan (2025-2030)',
    titleSo: 'Qorshaha Guud ee Sahanka & Balaarinta Tuulada Kulmis',
    category: 'Cadastre & Survey Map',
    fileName: 'Kulmis_Village_Masterplan_2026.pdf',
    fileSize: '2.4 MB',
    fileType: 'application/pdf',
    uploadedBy: 'Adan Deeq Abdirahman Issa (Lead Dev & Tech Team)',
    uploadedAt: '2025-01-10',
    description: 'Complete 240-hectare zoned masterplan detailing 500 residential plots (20x20m), 15m arterial boulevards, solar borehole coordinates, primary school, and public park.',
    isOfficialStamp: true,
    downloadCount: 342,
  },
  {
    id: 'doc-002',
    title: 'Elder Assembly Decree & Land Demarcation Charter',
    titleSo: 'Go’aanka Golaha Odayaasha Cali Saleebaan & Xeerka Dhulka Kulmis',
    category: 'Elder Council Decree',
    fileName: 'Elder_Assembly_Kulmis_Land_Decree_Signed.pdf',
    fileSize: '1.8 MB',
    fileType: 'application/pdf',
    uploadedBy: 'Ugaas Maxamuud Cali Shire (Elder Assembly)',
    uploadedAt: '2025-01-15',
    description: 'Ratified decree signed by 12 community elders affirming peaceful settlement, banning speculative land resale, and establishing the 5-elder arbitration council.',
    isOfficialStamp: true,
    downloadCount: 289,
  },
  {
    id: 'doc-003',
    title: 'Hydrogeological Water Survey & Solar Borehole Certification',
    titleSo: 'Warbixinta Sahanka Biyaha Macaanka & Shahaadada Ceelka Cadceedda',
    category: 'Water & Well Report',
    fileName: 'Kulmis_Solar_Borehole_Water_Survey_Report.pdf',
    fileSize: '3.1 MB',
    fileType: 'application/pdf',
    uploadedBy: 'Eng. Maxamed Saciid (Water & Borehole Specialist)',
    uploadedAt: '2025-02-08',
    description: 'Comprehensive geophysical resistivity study validating 8.5 cubic meter per hour potable freshwater aquifer at 110m depth powered by 24 solar PV modules.',
    isOfficialStamp: true,
    downloadCount: 194,
  },
  {
    id: 'doc-004',
    title: 'Cali Saleebaan Kismayo Committee Bylaws & Constitution',
    titleSo: 'Dastuurka & Qawaaniinta Rasmiga ah ee Tuulada Kulmis',
    category: 'Village Charter',
    fileName: 'Kulmis_Village_Official_Constitution_v2.pdf',
    fileSize: '1.5 MB',
    fileType: 'application/pdf',
    uploadedBy: 'Adan Deeq Abdirahman Issa (Lead Dev)',
    uploadedAt: '2025-02-28',
    description: 'The 8 core articles governing land tenure, communal water access, anti-charcoal ecological protection, dispute arbitration, and diaspora property rights.',
    isOfficialStamp: true,
    downloadCount: 412,
  }
];

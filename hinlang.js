/**
 * hinlang.js
 * Hinglish ↔ Hindi Transliterator for JavaScript
 * Ported from the hinlangpy Python library.
 * 
 * Perfect for Google Chrome Extensions. Zero dependencies.
 */

(function(global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        global.hinlang = factory();
    }
})(this, function() {
    'use strict';

    // ────────────────────────────────────────────────
    //  1. DICTIONARIES
    // ────────────────────────────────────────────────

    const ROMAN_TO_HINDI = {
        'namaste':   'नमस्ते',    'namaskar':  'नमस्कार',
        'hello':     'हेलो',      'hi':        'हाय',
        'bye':       'बाय',       'goodbye':   'गुडबाय',
        'shukriya':  'शुक्रिया',   'dhanyavaad':'धन्यवाद',
        'dhanyawad': 'धन्यवाद',   'sorry':     'सॉरी',
        'please':    'प्लीज़',     'welcome':   'वेलकम',
        'thankyou':  'थैंक यू',    'thanks':    'थैंक्स',
        'aap':    'आप',       'aapka':   'आपका',
        'aapki':  'आपकी',     'aapke':   'आपके',
        'main':   'मैं',       'mein':    'मैं',
        'mai':    'मैं',       'mera':    'मेरा',
        'meri':   'मेरी',      'mere':    'मेरे',
        'hum':    'हम',       'humara':  'हमारा',
        'humari': 'हमारी',     'humare':  'हमारे',
        'tum':    'तुम',      'tumhara': 'तुम्हारा',
        'tumhari':'तुम्हारी',   'tumhare': 'तुम्हारे',
        'tu':     'तू',       'tera':    'तेरा',
        'teri':   'तेरी',      'tere':    'तेरे',
        'woh':    'वो',       'wo':      'वो',
        'yeh':    'ये',       'ye':      'ये',
        'uska':   'उसका',     'uski':    'उसकी',
        'uske':   'उसके',     'iska':    'इसका',
        'iski':   'इसकी',     'iske':    'इसके',
        'kya':    'क्या',      'kyu':     'क्यों',
        'kyon':   'क्यों',      'kyun':    'क्यूं',
        'kaun':   'कौन',      'kahan':   'कहां',
        'kahaan': 'कहाँ',      'kaise':   'कैसे',
        'kaisa':  'कैसा',      'kaisi':   'कैसी',
        'kab':    'कब',       'kitna':   'कितना',
        'kitni':  'कितनी',     'kitne':   'कितने',
        'kon':    'कौन',      'konsa':   'कौनसा',
        'kidhar': 'किधर',      'idhar':   'इधर',
        'udhar':  'उधर',
        'hai':    'है',       'hain':    'हैं',
        'tha':    'था',       'thi':     'थी',
        'the':    'थे',       'ho':      'हो',
        'hoga':   'होगा',     'hogi':    'होगी',
        'hoge':   'होगे',     'hona':    'होना',
        'hoon':   'हूँ',       'hun':     'हूँ',
        'hu':     'हूँ',       'hoo':     'हूँ',
        'hua':    'हुआ',      'hui':     'हुई',
        'hue':    'हुए',
        'karo':   'करो',      'karna':   'करना',
        'karti':  'करती',     'karta':   'करता',
        'karte':  'करते',     'karega':  'करेगा',
        'karegi': 'करेगी',    'karenge': 'करेंगे',
        'kar':    'कर',       'kiya':    'किया',
        'kiye':   'किये',
        'ki':     'की',       'ka':      'का',
        'ke':     'के',       'ko':      'को',
        'se':     'से',       'me':      'में',
        'pe':     'पे',       'par':     'पर',
        'ne':     'ने',       'ya':      'या',
        'aur':    'और',       'or':      'और',
        'lekin':  'लेकिन',    'magar':   'मगर',
        'isliye': 'इसलिए',    'kyunki':  'क्योंकि',
        'agar':   'अगर',      'toh':     'तो',
        'to':     'तो',       'bhi':     'भी',
        'nahi':   'नहीं',      'nhi':     'नहीं',
        'nahin':  'नहीं',      'na':      'ना',
        'mat':    'मत',       'sirf':    'सिर्फ',
        'bas':    'बस',
        'jao':    'जाओ',      'jana':    'जाना',
        'jata':   'जाता',     'jati':    'जाती',
        'jate':   'जाते',     'gaya':    'गया',
        'gayi':   'गयी',      'gaye':    'गये',
        'jayega': 'जाएगा',    'jayegi':  'जाएगी',
        'ja':     'जा',
        'aao':    'आओ',       'aana':    'आना',
        'aata':   'आता',      'aati':    'आती',
        'aaye':   'आये',      'aaya':    'आया',
        'aayi':   'आयी',      'aayega':  'आएगा',
        'aayegi': 'आएगी',     'aa':      'आ',
        'khao':   'खाओ',      'khana':   'खाना',
        'peena':  'पीना',     'piyo':    'पियो',
        'dekho':  'देखो',     'dekhna':  'देखना',
        'suno':   'सुनो',     'sunna':   'सुनना',
        'bolo':   'बोलो',     'bolna':   'बोलना',
        'padho':  'पढ़ो',      'padhna':  'पढ़ना',
        'likho':  'लिखो',     'likhna':  'लिखना',
        'socho':  'सोचो',     'sochna':  'सोचना',
        'samjho': 'समझो',     'samajhna':'समझना',
        'batao':  'बताओ',     'batana':  'बताना',
        'chalo':  'चलो',      'chalna':  'चलना',
        'ruko':   'रुको',      'rukna':   'रुकना',
        'de':     'दे',       'dena':    'देना',
        'le':     'ले',       'lena':    'लेना',
        'do':     'दो',       'lo':      'लो',
        'raha':   'रहा',      'rahi':    'रही',
        'rahe':   'रहे',      'la':      'ला',
        'lao':    'लाओ',      'lana':    'लाना',
        'laao':   'लाओ',      'diya':    'दिया',
        'diyo':   'दियो',     'liya':    'लिया',
        'bol':    'बोल',      'chal':    'चल',
        'mil':    'मिल',      'milte':   'मिलते',
        'milna':  'मिलना',    'mila':    'मिला',
        'mili':   'मिली',     'mile':    'मिले',
        'chalte': 'चलते',     'rok':     'रोक',
        'dekh':   'देख',      'sun':     'सुन',
        'padh':   'पढ़',       'likh':    'लिख',
        'soch':   'सोच',      'samajh':  'समझ',
        'bata':   'बता',      'chahiye': 'चाहिए',
        'chahte': 'चाहते',    'chahta':  'चाहता',
        'chahti': 'चाहती',
        'dost':   'दोस्त',    'dosto':   'दोस्तो',
        'bhai':   'भाई',      'bhaiya':  'भैया',
        'behan':  'बहन',      'didi':    'दीदी',
        'maa':    'माँ',       'papa':    'पापा',
        'baap':   'बाप',      'beta':    'बेटा',
        'beti':   'बेटी',     'bachcha': 'बच्चा',
        'bachche':'बच्चे',     'aadmi':   'आदमी',
        'aurat':  'औरत',      'ladka':   'लड़का',
        'ladki':  'लड़की',     'log':     'लोग',
        'guru':   'गुरु',     'sir':     'सर',
        'ghar':   'घर',       'school':  'स्कूल',
        'paani':  'पानी',     'roti':    'रोटी',
        'doodh':  'दूध',      'chai':    'चाय',
        'kaam':   'काम',      'paisa':   'पैसा',
        'paise':  'पैसे',     'time':    'टाइम',
        'din':    'दिन',      'raat':    'रात',
        'subah':  'सुबह',     'shaam':   'शाम',
        'saal':   'साल',      'mahina':  'महीना',
        'hafta':  'हफ्ता',     'desh':    'देश',
        'duniya': 'दुनिया',    'zindagi': 'ज़िंदगी',
        'pyaar':  'प्यार',     'dil':     'दिल',
        'mann':   'मन',       'khushi':  'खुशी',
        'dukh':   'दुख',      'sapna':   'सपना',
        'sapne':  'सपने',     'aasman':  'आसमान',
        'dharti': 'धरती',     'hawa':    'हवा',
        'aag':    'आग',       'naam':    'नाम',
        'jagah':  'जगह',      'baat':    'बात',
        'cheez':  'चीज़',      'tarah':   'तरह',
        'wajah':  'वजह',      'matlab':  'मतलब',
        'mausam': 'मौसम',     'rang':    'रंग',
        'shahar': 'शहर',      'gaon':    'गाँव',
        'sadak':  'सड़क',      'raasta':  'रास्ता',
        'darwaza':'दरवाज़ा',   'kamra':   'कमरा',
        'kursi':  'कुर्सी',    'mez':     'मेज़',
        'kitab':  'किताब',     'kalam':   'कलम',
        'kapda':  'कपड़ा',     'kapde':   'कपड़े',
        'joota':  'जूता',      'phone':   'फ़ोन',
        'computer':'कंप्यूटर',  'gaadi':   'गाड़ी',
        'train':  'ट्रेन',     'pata':    'पता',
        'accha':  'अच्छा',    'acchi':   'अच्छी',
        'acche':  'अच्छे',    'bura':    'बुरा',
        'buri':   'बुरी',     'bure':    'बुरे',
        'bada':   'बड़ा',      'badi':    'बड़ी',
        'bade':   'बड़े',      'chhota':  'छोटा',
        'chhoti': 'छोटी',     'chhote':  'छोटे',
        'naya':   'नया',      'nayi':    'नयी',
        'naye':   'नये',      'purana':  'पुराना',
        'purani': 'पुरानी',    'purane':  'पुराने',
        'sab':    'सब',       'sabhi':   'सभी',
        'kuch':   'कुछ',      'bahut':   'बहुत',
        'bohot':  'बहुत',     'zyada':   'ज़्यादा',
        'kam':    'कम',       'thoda':   'थोड़ा',
        'thodi':  'थोड़ी',     'thode':   'थोड़े',
        'pehle':  'पहले',     'baad':    'बाद',
        'abhi':   'अभी',      'ab':      'अब',
        'tab':    'तब',       'jab':     'जब',
        'yaha':   'यहाँ',      'yahan':   'यहाँ',
        'waha':   'वहाँ',      'wahan':   'वहाँ',
        'hamesha':'हमेशा',     'kabhi':   'कभी',
        'phir':   'फिर',      'fir':     'फिर',
        'bilkul': 'बिलकुल',    'sach':    'सच',
        'jhooth': 'झूठ',       'theek':   'ठीक',
        'thik':   'ठीक',      'khush':   'खुश',
        'udaas':  'उदास',     'khubsoorat': 'खूबसूरत',
        'khoobsurat':'खूबसूरत', 'sundar':  'सुंदर',
        'mazedaar':'मज़ेदार',   'behtareen':'बेहतरीन',
        'garam':  'गरम',      'thanda':  'ठंडा',
        'thandi': 'ठंडी',
        'ek':     'एक',       'teen':    'तीन',
        'char':   'चार',      'paanch':  'पाँच',
        'chhe':   'छे',       'saat':    'सात',
        'aath':   'आठ',       'nau':     'नौ',
        'das':    'दस',       'sau':     'सौ',
        'hazaar': 'हज़ार',     'lakh':    'लाख',
        'crore':  'करोड़',
        'aaj':    'आज',       'kal':     'कल',
        'parso':  'परसो',     'roz':     'रोज़',
        'shaayad':'शायद',     'shayad':  'शायद',
        'zaroor': 'ज़रूर',     'jaroor':  'ज़रूर',
        'mushkil':'मुश्किल',   'aasan':   'आसान',
        'achanak':'अचानक',
        'sochiye':'सोचिए',     'dekhiye': 'देखिए',
        'suniye': 'सुनिए',     'boliye':  'बोलिए',
        'chaliye':'चलिए',      'kariye':  'करिए',
        'dijiye': 'दीजिए',     'lijiye':  'लीजिए',
        'aapko':  'आपको',     'mujhe':   'मुझे',
        'mujhko': 'मुझको',     'tujhe':   'तुझे',
        'humko':  'हमको',      'humein':  'हमें',
        'tumko':  'तुमको',     'tumhein': 'तुम्हें',
        'unko':   'उनको',     'unhe':    'उन्हें',
        'inko':   'इनको',     'inhe':    'इन्हें',
        'jiske':  'जिसके',     'kiske':   'किसके',
        'sabko':  'सबको',     'sabke':   'सबके',
        'saath':  'साथ',
        'wala':   'वाला',     'wali':    'वाली',
        'wale':   'वाले',     'waala':   'वाला',
        'waali':  'वाली',     'waale':   'वाले',
        'mujhse': 'मुझसे',    'tumse':   'तुमसे',
        'aapse':  'आपसे',     'unse':    'उनसे',
        'isme':   'इसमें',     'usme':    'उसमें',
        'jisme':  'जिसमें',    'kisme':   'किसमें',
        'sabme':  'सबमें',     'mujhpe':  'मुझपे',
        'apna':   'अपना',     'apni':    'अपनी',
        'apne':   'अपने',     'khud':    'खुद',
        'koi':    'कोई',      'kisi':    'किसी',
        'dusra':  'दूसरा',    'dusri':   'दूसरी',
        'dusre':  'दूसरे',    'pura':    'पूरा',
        'puri':   'पूरी',      'pure':    'पूरे',
    };

    const HINDI_TO_ROMAN_OVERRIDES = {
        'मैं':    'main',
        'में':    'mein',
        'और':    'aur',
        'नहीं':   'nahi',
        'तो':    'toh',
        'वो':    'woh',
        'ये':    'yeh',
        'दो':    'do',
        'हूँ':    'hoon',
        'क्यों':  'kyon',
        'कहाँ':  'kahaan',
        'कहां':  'kahaan',
        'बहुत':  'bahut',
        'फिर':   'phir',
        'ठीक':   'theek',
        'यहाँ':   'yahaan',
        'वहाँ':   'wahaan',
        'गाँव':   'gaon',
        'ॐ':     'om',
        'श्री':   'shri',
    };

    const SPECIALS = {
        'om':   'ॐ',
        'shri': 'श्री',
        'sri':  'श्री',
    };

    // Auto-generate reverse dictionary
    const HINDI_TO_ROMAN = {};
    const seen_hindi = new Set();
    for (const [roman, hindi] of Object.entries(ROMAN_TO_HINDI)) {
        if (!seen_hindi.has(hindi)) {
            HINDI_TO_ROMAN[hindi] = roman;
            seen_hindi.add(hindi);
        }
    }
    Object.assign(HINDI_TO_ROMAN, HINDI_TO_ROMAN_OVERRIDES);

    // ────────────────────────────────────────────────
    //  2. HELPERS
    // ────────────────────────────────────────────────

    function isAlpha(ch) { return /^[a-zA-Z]$/.test(ch); }
    function isDigit(ch) { return /^[0-9]$/.test(ch); }
    function isAlnum(ch) { return /^[a-zA-Z0-9]$/.test(ch); }
    function isSpace(ch) { return /^\s$/.test(ch); }
    function isDevanagariChar(ch) {
        if (!ch) return false;
        const cp = ch.codePointAt(0);
        return cp >= 0x0900 && cp <= 0x097F;
    }

    // ────────────────────────────────────────────────
    //  3. ROMAN TO HINDI ENGINE
    // ────────────────────────────────────────────────

    class RomanToHindi {
        constructor() {
            this._vowels = {
                'aa': 'आ', 'ai': 'ऐ', 'au': 'औ',
                'ee': 'ई', 'oo': 'ऊ', 'ou': 'औ',
                'a':  'अ', 'e':  'ए', 'i':  'इ',
                'o':  'ओ', 'u':  'उ',
            };

            this._matras = {
                'aa': 'ा',  'ai': 'ै',  'au': 'ौ',
                'ee': 'ी',  'oo': 'ू',  'ou': 'ौ',
                'a':  '',    'e':  'े',  'i':  'ि',
                'o':  'ो',  'u':  'ु',
            };

            this._consonants = {
                'shree': 'श्री',
                'ksha': 'क्ष', 'gnya': 'ज्ञ', 'dnya': 'ज्ञ',
                'shra': 'श्र', 'thra': 'थ्र', 'ttra': 'त्र',
                'bha': 'भ',  'cha': 'च',  'chh': 'छ',
                'dha': 'ध',  'gha': 'घ',  'jha': 'झ',
                'kha': 'ख',  'nka': 'ंक', 'pha': 'फ',
                'sha': 'श',  'shh': 'ष',  'tha': 'थ',
                'tra': 'त्र', 'nga': 'ंग',
                'nha': 'न्ह', 'lha': 'ल्ह',
                'bh': 'भ',  'ch': 'च',  'dh': 'ध',
                'gh': 'घ',  'jh': 'झ',  'kh': 'ख',
                'ph': 'फ',  'sh': 'श',  'th': 'थ',
                'tr': 'त्र', 'ng': 'ंग', 'nn': 'ण',
                'ny': 'ञ',  'rh': 'ढ',
                'b': 'ब',  'c': 'क',  'd': 'द',  'f': 'फ',
                'g': 'ग',  'h': 'ह',  'j': 'ज',  'k': 'क',
                'l': 'ल',  'm': 'म',  'n': 'न',  'p': 'प',
                'q': 'क़', 'r': 'र',  's': 'स',  't': 'त',
                'v': 'व',  'w': 'व',  'x': 'क्स', 'y': 'य',
                'z': 'ज़',
            };

            this._digits = {
                '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
                '5': '५', '6': '६', '7': '७', '8': '८', '9': '९',
            };

            this._punctuation = {
                '.': '।', '|': '।', '||': '॥',
            };

            this._dictionary = Object.assign({}, ROMAN_TO_HINDI);
            this._specials = Object.assign({}, SPECIALS);
        }

        add_word(roman, hindi) {
            this._dictionary[roman.toLowerCase().trim()] = hindi;
        }

        add_words(mapping) {
            for (const [roman, hindi] of Object.entries(mapping)) {
                this._dictionary[roman.toLowerCase().trim()] = hindi;
            }
        }

        transliterate(text) {
            if (!text) return "";
            const words = text.split(/\s+/);
            const result = [];

            for (let word of words) {
                if (!word) continue;
                let [prefix, core, suffix] = this._strip_punctuation(word);
                let converted_suffix = suffix.split('').map(ch => this._punctuation[ch] || ch).join('');
                let dev_word = core ? this._convert_word(core) : '';
                result.push(prefix + dev_word + converted_suffix);
            }

            return result.join(' ');
        }

        _strip_punctuation(word) {
            let prefix = '';
            let suffix = '';
            while (word && !isAlnum(word[0])) {
                prefix += word[0];
                word = word.slice(1);
            }
            while (word && !isAlnum(word[word.length - 1])) {
                suffix = word[word.length - 1] + suffix;
                word = word.slice(0, -1);
            }
            return [prefix, word, suffix];
        }

        _match_consonant(text, pos) {
            for (let len of [5, 4, 3, 2, 1]) {
                let chunk = text.slice(pos, pos + len);
                if (this._consonants.hasOwnProperty(chunk)) {
                    return [chunk, this._consonants[chunk]];
                }
            }
            return [null, null];
        }

        _match_matra(text, pos) {
            for (let len of [2, 1]) {
                let chunk = text.slice(pos, pos + len);
                if (this._matras.hasOwnProperty(chunk)) {
                    return [chunk, this._matras[chunk]];
                }
            }
            return [null, null];
        }

        _match_vowel(text, pos) {
            for (let len of [2, 1]) {
                let chunk = text.slice(pos, pos + len);
                if (this._vowels.hasOwnProperty(chunk)) {
                    return [chunk, this._vowels[chunk]];
                }
            }
            return [null, null];
        }

        _convert_word(word) {
            let lower = word.toLowerCase().trim();
            if (!lower) return word;

            if (this._dictionary.hasOwnProperty(lower)) return this._dictionary[lower];
            if (this._specials.hasOwnProperty(lower)) return this._specials[lower];

            let result = [];
            let i = 0;
            let length = lower.length;
            let last_was_consonant = false;

            while (i < length) {
                let ch = lower[i];

                if (isDigit(ch)) {
                    result.push(this._digits[ch] || ch);
                    last_was_consonant = false;
                    i++;
                    continue;
                }

                if (!isAlpha(ch)) {
                    result.push(ch);
                    last_was_consonant = false;
                    i++;
                    continue;
                }

                if (ch === 'n' && i + 1 < length && !'aeiou'.includes(lower[i+1]) && isAlpha(lower[i+1])) {
                    if ('gkcdjtpb'.includes(lower[i+1])) {
                        result.push('ं');
                        last_was_consonant = false;
                        i++;
                        continue;
                    }
                }

                let [cons_match, cons_dev] = this._match_consonant(lower, i);
                if (cons_match) {
                    if (last_was_consonant) {
                        result.push('्');
                    }
                    result.push(cons_dev);
                    i += cons_match.length;

                    if (i < length) {
                        let [matra_match, matra_dev] = this._match_matra(lower, i);
                        if (matra_match) {
                            result.push(matra_dev);
                            i += matra_match.length;
                            last_was_consonant = false;
                            continue;
                        }
                    }
                    last_was_consonant = true;
                    continue;
                }

                let [vowel_match, vowel_dev] = this._match_vowel(lower, i);
                if (vowel_match) {
                    if (last_was_consonant) {
                        let [matra_match, matra_dev] = this._match_matra(lower, i);
                        if (matra_match) {
                            result.push(matra_dev);
                            i += matra_match.length;
                            last_was_consonant = false;
                            continue;
                        }
                    }
                    result.push(vowel_dev);
                    i += vowel_match.length;
                    last_was_consonant = false;
                    continue;
                }

                result.push(ch);
                last_was_consonant = false;
                i++;
            }
            return result.join('');
        }
    }

    // ────────────────────────────────────────────────
    //  4. HINDI TO ROMAN ENGINE
    // ────────────────────────────────────────────────

    class HindiToRoman {
        constructor() {
            this._vowel_map = {
                'अ': 'a',   'आ': 'aa',  'इ': 'i',   'ई': 'ee',
                'उ': 'u',   'ऊ': 'oo',  'ए': 'e',   'ऐ': 'ai',
                'ओ': 'o',   'औ': 'au',  'ऋ': 'ri',  'ॠ': 'ri',
                'ऑ': 'o',
            };

            this._matra_map = {
                'ा': 'aa',  'ि': 'i',   'ी': 'ee',  'ु': 'u',
                'ू': 'oo',  'े': 'e',   'ै': 'ai',  'ो': 'o',
                'ौ': 'au',  'ृ': 'ri',  'ॉ': 'o',
            };

            this._consonant_map = {
                'क': 'k',   'ख': 'kh',  'ग': 'g',   'घ': 'gh',  'ङ': 'ng',
                'च': 'ch',  'छ': 'chh', 'ज': 'j',   'झ': 'jh',  'ञ': 'ny',
                'ट': 't',   'ठ': 'th',  'ड': 'd',   'ढ': 'dh',  'ण': 'n',
                'त': 't',   'थ': 'th',  'द': 'd',   'ध': 'dh',  'न': 'n',
                'प': 'p',   'फ': 'ph',  'ब': 'b',   'भ': 'bh',  'म': 'm',
                'य': 'y',   'र': 'r',   'ल': 'l',   'व': 'v',
                'श': 'sh',  'ष': 'sh',  'स': 's',   'ह': 'h',
                'क्ष': 'ksh', 'त्र': 'tr', 'ज्ञ': 'gya', 'श्र': 'shr',
            };

            this._nukta_map = {
                'क़': 'q',   'ख़': 'kh',  'ग़': 'gh',  'ज़': 'z',
                'ड़': 'd',   'ढ़': 'dh',  'फ़': 'f',   'य़': 'y',
            };

            this._special_map = {
                'ं': 'n',    'ँ': 'n',    'ः': 'h',
                '्': '',     'ॐ': 'om',
            };

            this._digit_map = {
                '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
                '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
            };

            this._punct_map = {
                '।': '.', '॥': '||',
            };

            this._dictionary = Object.assign({}, HINDI_TO_ROMAN);
        }

        add_word(hindi, roman) {
            this._dictionary[hindi.trim()] = roman.toLowerCase().trim();
        }

        add_words(mapping) {
            for (const [hindi, roman] of Object.entries(mapping)) {
                this._dictionary[hindi.trim()] = roman.toLowerCase().trim();
            }
        }

        transliterate(text) {
            if (!text) return "";
            const words = text.split(/\s+/);
            const result = [];

            for (let word of words) {
                if (!word) continue;
                let [prefix, core, suffix] = this._strip_punctuation(word);
                let converted_suffix = suffix.split('').map(ch => this._punct_map[ch] || ch).join('');
                let roman_word = core ? this._convert_word(core) : '';
                result.push(prefix + roman_word + converted_suffix);
            }

            return result.join(' ');
        }

        _is_devanagari(ch) {
            if (!ch) return false;
            return isDevanagariChar(ch);
        }

        _strip_punctuation(word) {
            let prefix = '';
            let suffix = '';
            while (word && !(this._is_devanagari(word[0]) || isAlnum(word[0]))) {
                prefix += word[0];
                word = word.slice(1);
            }
            while (word && !(this._is_devanagari(word[word.length - 1]) || isAlnum(word[word.length - 1]))) {
                suffix = word[word.length - 1] + suffix;
                word = word.slice(0, -1);
            }
            return [prefix, word, suffix];
        }

        _convert_word(word) {
            if (!word) return word;

            if (this._dictionary.hasOwnProperty(word)) return this._dictionary[word];

            let result = [];
            let i = 0;
            let length = word.length;

            while (i < length) {
                let ch = word[i];

                if (this._digit_map.hasOwnProperty(ch)) {
                    result.push(this._digit_map[ch]);
                    i++;
                    continue;
                }

                if (this._punct_map.hasOwnProperty(ch)) {
                    result.push(this._punct_map[ch]);
                    i++;
                    continue;
                }

                if (this._special_map.hasOwnProperty(ch) && ch !== '्') {
                    result.push(this._special_map[ch]);
                    i++;
                    continue;
                }

                if (i + 1 < length) {
                    let two_char = word.slice(i, i + 2);
                    if (this._consonant_map.hasOwnProperty(two_char)) {
                        let roman = this._consonant_map[two_char];
                        i += 2;
                        if (i < length && word[i] === '्') {
                            i++;
                        } else if (i < length && this._matra_map.hasOwnProperty(word[i])) {
                            roman += this._matra_map[word[i]];
                            i++;
                        } else {
                            if (i < length && this._is_devanagari(word[i])) {
                                roman += 'a';
                            }
                        }
                        result.push(roman);
                        continue;
                    }
                }

                if (this._nukta_map.hasOwnProperty(ch)) {
                    let roman = this._nukta_map[ch];
                    i++;
                    if (i < length && word[i] === '्') {
                        i++;
                    } else if (i < length && this._matra_map.hasOwnProperty(word[i])) {
                        roman += this._matra_map[word[i]];
                        i++;
                    } else {
                        if (i < length && this._is_devanagari(word[i])) {
                            roman += 'a';
                        }
                    }
                    result.push(roman);
                    continue;
                }

                if (this._consonant_map.hasOwnProperty(ch)) {
                    let roman = this._consonant_map[ch];
                    i++;
                    if (i < length && word[i] === '्') {
                        i++;
                    } else if (i < length && this._matra_map.hasOwnProperty(word[i])) {
                        roman += this._matra_map[word[i]];
                        i++;
                    } else {
                        if (i < length && this._is_devanagari(word[i])) {
                            roman += 'a';
                        }
                    }
                    result.push(roman);
                    continue;
                }

                if (this._vowel_map.hasOwnProperty(ch)) {
                    result.push(this._vowel_map[ch]);
                    i++;
                    continue;
                }

                result.push(ch);
                i++;
            }
            return result.join('');
        }
    }

    // ────────────────────────────────────────────────
    //  5. DETECTOR
    // ────────────────────────────────────────────────

    function detect_script(text) {
        if (!text || !text.trim()) return "empty";

        let roman_count = 0;
        let devanagari_count = 0;

        for (let i = 0; i < text.length; i++) {
            let ch = text[i];
            if (isSpace(ch) || (!isAlpha(ch) && !isDevanagariChar(ch))) {
                continue;
            }
            if (isDevanagariChar(ch)) {
                devanagari_count++;
            } else if (isAlpha(ch)) {
                roman_count++;
            }
        }

        let total = roman_count + devanagari_count;
        if (total === 0) return "empty";

        let roman_ratio = roman_count / total;
        let dev_ratio = devanagari_count / total;

        if (dev_ratio >= 0.7) {
            return "devanagari";
        } else if (roman_ratio >= 0.7) {
            return "roman";
        } else {
            return "mixed";
        }
    }

    // ────────────────────────────────────────────────
    //  6. PUBLIC API
    // ────────────────────────────────────────────────

    let _r2h = null;
    let _h2r = null;

    function get_r2h() {
        if (!_r2h) _r2h = new RomanToHindi();
        return _r2h;
    }

    function get_h2r() {
        if (!_h2r) _h2r = new HindiToRoman();
        return _h2r;
    }

    function to_hindi(text) {
        return get_r2h().transliterate(text);
    }

    function to_roman(text) {
        return get_h2r().transliterate(text);
    }

    function convert(text) {
        const script = detect_script(text);
        if (script === "devanagari") {
            return to_roman(text);
        } else {
            return to_hindi(text);
        }
    }

    function to_hindi_batch(texts) {
        return texts.map(t => to_hindi(t));
    }

    function to_roman_batch(texts) {
        return texts.map(t => to_roman(t));
    }

    return {
        to_hindi,
        to_roman,
        convert,
        to_hindi_batch,
        to_roman_batch,
        detect_script,
        RomanToHindi,
        HindiToRoman
    };
});

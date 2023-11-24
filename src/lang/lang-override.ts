import Lang from "lang.js";

class LangOverride extends Lang {
    get(key: any, replacements: any = null, locale: any = super.getLocale()){
        let localeOverrided = locale + ".override";

        //We replace the fallback the has doesn't check the fallback but only the locale overrided
        let fallback = this.getFallback();
        this.setFallback(undefined);

        if(super.has(key,localeOverrided)){
            //Try to get the overrided value
            this.setFallback(fallback);
            return super.get(key, replacements, localeOverrided);
        }

        this.setFallback(fallback);
        //Finally, try to get the default value
        return super.get(key, replacements, locale);
    }
}

export default LangOverride;

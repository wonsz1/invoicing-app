import _ from 'lodash'
import i18next from 'i18next'
import { locales } from '../../config/i18n'

export const setUiLocale = (locale) => {
    if(!_.find(locales, supported => {
        supported.code === locale
    })) {
        return Promise.reject(`Locale ${locale} is not supported.`)
    }

    return fetch(`/static/translations/${locale}.json`)
        .then(response => response.json())
        .then(loadResources => {
            new Promise((res, rej) => {
                i18next.init({
                    lng: locale,
                    debug: true,
                    resources: { [locale]: loadResources},
                }, (err) => {
                    if(err) {
                        reject(err)
                        retrurn
                    }
                })
            })
        }).catch(err => Promise.reject(err))
}

export const t = (key, opt) => i18next.t(key, opt)
export const currentLocale = () => i18next.language
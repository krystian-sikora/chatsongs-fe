import { defineStore } from 'pinia'
import { ref } from "vue";
import { addContact, getContacts } from "@/api/api.js";

export const useContactStore = defineStore('contacts', {
    state: () => {
        return {
            contacts: ref([])
        }
    },
    actions: {
        addContact(token, contactId) {
            addContact(token, contactId).then(
                (res) => {
                    this.contacts.push(res.data)
                }
            )
        },
        getContacts(token) {
            getContacts(token).then(
                (res) => {
                    this.contacts = res.data
                }
            )
        }
    },
})
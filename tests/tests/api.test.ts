/* 1) I have chosen to write the two tests against a factory interface (PetApiFactory) instead of the object oriented interface (PetApi) for the following reasons:
        a) PetApi only deligates a call to the factory interface and so can be left untested.
        b) PetApiFactory is more testable as its easier to inject a mocked axios instance.
    2) For the addPet endpoint, I only asserted that the right parameters are sent to the api since no response data expected back from the server
    3) For the findPetsByTags endpoint, It's important we ensure we are calling the right url and with the right parameters and also assert that data is returned.
*/

import {Pet, PetApiFactory } from '../../api-client/api';
import { Configuration } from '../../api-client/configuration';
import Axios from 'axios';

jest.mock('Axios');
const mockedAxios = Axios as jest.Mocked<typeof Axios>;
const CONFIG: Configuration = new Configuration({
    apiKey: 'testapikey',
    password: 'notop',
    username: 'amby',
    accessToken: 'testAaccessToken',
    basePath: "http://www.erer.re"
});
const petApiFactory = PetApiFactory(CONFIG,CONFIG.basePath,Axios);

describe('PetApi', () => {
    it('Should form a proper post request to the api', () => {
        const pet: Pet = { name: 'erer', photoUrls: ['photoUrl'] };
        const finalOptions: any = {
            url: CONFIG.basePath + "/pet",
            options: {
                method: 'POST',
                ...CONFIG.baseOptions,
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + CONFIG.accessToken },
                data: JSON.stringify(pet)
            }
        };
        mockedAxios.request.mockResolvedValue({});
        petApiFactory.addPet(pet);
        expect(mockedAxios.request.mock.calls.length).toBe(1);
        expect(mockedAxios.request.mock.calls[0][0]).toBe(finalOptions);
    });

    it('Should be able to query pet objects by tags', () => {
        const pets: Pet[] = [{ name: 'bruce', photoUrls: ['photoUrl'] },
        { name: 'roy', photoUrls: ['photoUrl'] }];
        const finalOptions: any = {
            url: CONFIG.basePath + "/pet/findByTags?tag=bruce&tag=roy",
            options: {
                method: 'GET',
                ...CONFIG.baseOptions,
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + CONFIG.accessToken }
            }
        };
        mockedAxios.request.mockResolvedValue(pets);
        petApiFactory.findPetsByTags(['bruce', 'roy']).then(data => {expect(data).toEqual(pets)});
        expect(mockedAxios.request.mock.calls[0][0]).toBe(finalOptions);
    });

});

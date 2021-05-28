import { PetApi, Pet } from '../../api-client/api';
import { Configuration } from '../../api-client/configuration';
import globalAxios, { } from 'axios';

jest.mock('globalAxios');
const mockedAxios = globalAxios as jest.Mocked<typeof globalAxios>;
const CONFIG: Configuration = new Configuration({
    apiKey: 'testapikey',
    password: 'notop',
    username: 'amby',
    accessToken: 'testAaccessToken',
    basePath: "http://www.erer.re"
});

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
        new PetApi(CONFIG).addPet(pet, {});
        expect(mockedAxios.request.mock.calls.length).toBe(1);
        expect(mockedAxios.request.mock.calls[0][0]).toBe(finalOptions);
    });

    it('Should be able to retrieve a pet object by id', () => {
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
        new PetApi(CONFIG).findPetsByTags(['bruce', 'roy']).then(data => {expect(data).toEqual(pets)});
        expect(mockedAxios.request.mock.calls[0][0]).toBe(finalOptions);
    });

});
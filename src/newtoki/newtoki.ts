import {
    PagedResults,
    Source,
    Manga,
    Chapter,
    ChapterDetails,
    HomeSection,
    SearchRequest,
    SourceInfo,
    ContentRating,
    LanguageCode,
    Request,
    Response,
} from 'paperback-extensions-common'

import {Parser} from './NewTokiParser'
const NewToki_Base = 'https://newtoki143.com'

export const TCBScansInfo: SourceInfo = {
    author: 'SATAN',
    description: 'Extension that pulls webtoon from NewToki',
    icon: 'icon.png',
    name: 'NewToki',
    version: '1.0.0',
    authorWebsite: 'https://github.com/ModulX',
    websiteBaseURL: NewToki_Base,
    contentRating: ContentRating.EVERYONE,
    language: LanguageCode.KOREAN,
}

export class TCBScans extends Source {
    private readonly parser: Parser = new Parser()

    readonly requestManager = createRequestManager({
        requestsPerSecond: 3,
        requestTimeout: 15000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {

                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'referer': NewToki_Base
                    }
                }

                return request
            },

            interceptResponse: async (response: Response): Promise<Response> => {
                return response
            }
        }
    })
    override getMangaShareUrl(mangaId: string): string {
        return `${NewToki_Base}/mangas/${mangaId}`
    }

    override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const options = createRequestObject({
            url: `${NewToki_Base}/projects`,
            method: 'GET'
        })
        const response = await this.requestManager.schedule(options, 1)
        const $ = this.cheerio.load(response.data)
        return this.parser.parseHomeSections($,sectionCallback, this)
    }

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const options = createRequestObject({
            url: `${NewToki_Base}/mangas/${mangaId}`,
            method: 'GET',
        })
        const response = await this.requestManager.schedule(options, 1)
        const $ = this.cheerio.load(response.data)
        return this.parser.parseMangaDetails($, mangaId,this)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const options = createRequestObject({
            url: `${NewToki_Base}/mangas/${mangaId}`,
            method: 'GET'
        })
        const response = await this.requestManager.schedule(options, 1)
        const $ = this.cheerio.load(response.data)
        return this.parser.parseChapters($, mangaId, this)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const options = createRequestObject({
            url: `${NewToki_Base}${chapterId}`,
            method: 'GET'
        })
        const response = await this.requestManager.schedule(options, 1)
        const $ = this.cheerio.load(response.data)
 
        return this.parser.parseChapterDetails($, mangaId, chapterId)
    }

    async getSearchResults(_query: SearchRequest, _metadata: any): Promise<PagedResults> {
        return createPagedResults({
            results: [],
        })
    }
}
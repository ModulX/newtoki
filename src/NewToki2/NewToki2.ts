import {
    Chapter,
    ChapterDetails,
    ContentRating,
    HomeSection,
    Manga,
    PagedResults,
    SearchRequest,
    Section,
    Source,
    SourceInfo,
    Request,
    Response,
    TagSection,
    TagType,
    MangaStatus,
    // FormRow
} from 'paperback-extensions-common'
import { contentSettings } from './NewToki2Settings'


const WEBTOONS_DOMAIN = 'https://www.webtoons.com'
// const WEBTOONS_MOBILE_DOMAIN = 'https://m.webtoons.com'
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44'
let langString = 'en' // Only used for 'getMangaShareUrl' function

export const WebtoonsInfo: SourceInfo = {
    version: '1.0.0',
    name: 'NewToki',
    description: 'Extension that pulls comics from NewToki.',
    author: 'SATAN',
    authorWebsite: 'http://github.com/ModulX',
    icon: 'logo.png',
    contentRating: ContentRating.EVERYONE,
    websiteBaseURL: WEBTOONS_DOMAIN,
    sourceTags: [
        {
            text: 'Korean',
            type: TagType.GREEN,
        },
    ],
}

export class NewToki2 extends Source {


    stateManager = createSourceStateManager({})

    requestManager = createRequestManager({
        requestsPerSecond: 3,
        requestTimeout: 15000,
        interceptor: {
            interceptRequest: async (request: Request): Promise<Request> => {
                request.headers = {
                    ...(request.headers ?? {}),
                    ...{
                        'user-agent': userAgent,
                        'referer': `${WEBTOONS_DOMAIN}/`,
                        'cookie': 'pagGDPR=true;'
                    }
                }

                return request
            },

            interceptResponse: async (response: Response): Promise<Response> => {
                return response
            }
        }
    })

    override async getSourceMenu(): Promise<Section> {
        return Promise.resolve(createSection({
            id: 'main',
            header: 'Source Settings',
            rows: async () => [
                await contentSettings(this.stateManager),
            ]
        }))
    }

    override getMangaShareUrl(mangaId: string): string {
        return `${WEBTOONS_DOMAIN}/${langString}/${mangaId}` // langString is 'en' by default.
    }

    override async getMangaDetails(mangaId: string): Promise<Manga> {
        return {
            titles: ["NewToki"],
            image: "https://www.webtoons.com/images/common/noImage_l.png",
            status: MangaStatus.COMPLETED,
        }
    }

    override async getChapters(mangaId: string): Promise<Chapter[]> {
        return []
    }

    override async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        return {
            id: chapterId,
            mangaId: mangaId,
            pages: [],
            longStrip: false,
        }
    }

    override async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        return {
            results: [],
        }
    }

    override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
    }

    override async getTags(): Promise<TagSection[]> {
        return []
    }
}

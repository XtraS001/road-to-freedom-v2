/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.2.1263 on 2025-12-26 23:52:11.

export interface Portfolio extends AbstractEntity {
    portfolioName: string;
    realizedGain: number;
    unrealizedGain: number;
    user: User;
    items: PortfolioItem[];
}

export interface PortfolioItem extends AbstractEntity {
    stockSymbol: string;
    averageCost: number;
    currentQuote: number;
    quantity: number;
    portfolio: Portfolio;
}

export interface PortfolioDto {
    id: number;
    portfolioName: string;
    realizedGain: number;
    unrealizedGain: number;
    userDto: UserDto;
}

export interface PortfolioItemDto {
    id: number;
    stockSymbol: string;
    averageCost: number;
    currentQuote: number;
    quantity: number;
    portfolioDto: PortfolioDto;
}

export interface Notification {
    id: number;
    title: string;
    message: string;
    url: string;
    delivered: boolean;
    createdAt: Date;
}

export interface NotificationPermissionRequest {
    id?: number;
    requestedBy: RequestEvent;
    deniedReason: DeniedReason;
    createdAt?: Date;
}

export interface PushNotificationSubscription {
    id: number;
    endpoint: string;
    p256dhKey: string;
    authKey: string;
    createdAt: Date;
}

export interface SendNotificationRequest {
    title: string;
    message: string;
    url: string;
}

export interface SubscriptionRequest {
    endpoint: string;
    p256dh: string;
    auth: string;
}

export interface NotificationSubscribersByDate {
    date: string;
    subscribers: number;
}

export interface NotificationsByDate {
    date: string;
    delivered: number;
    sent: number;
}

export interface UploadedFile extends AbstractEntity {
    url: string;
    size: number;
    originalFileName: string;
    extension: string;
    createdAt: Date;
    uploadedAt: Date;
}

export interface Stock extends AbstractEntity {
    symbol: string;
    name: string;
    exchange: string;
    currentQuote: number;
    watchlists: Watchlist[];
    orphan: boolean;
}

export interface CreateStockRequest {
    symbol: string;
    name: string;
    currentQuote: number;
    exchange: string;
    watchlistId: number;
}

export interface StockDto {
    id: number;
    symbol: string;
    name: string;
    currentQuote: number;
    exchange: string;
    watchlistIds: number[];
}

export interface Trade extends AbstractEntity {
    stockSymbol: string;
    buyPrice: number;
    sellPrice: number;
    quantity: number;
    buyDate: Date;
    sellDate: Date;
    user: User;
}

export interface BuyTradeRequest {
    stockSymbol: string;
    buyPrice: number;
    quantity: number;
    buyDate: Date;
    stockDto: StockDto;
}

export interface SellTradeRequest {
    stockSymbol: string;
    sellPrice: number;
    quantity: number;
    sellDate: Date;
    stockDto: StockDto;
}

export interface TradeDto {
    id: number;
    stockSymbol: string;
    buyPrice: number;
    sellPrice: number;
    quantity: number;
    buyDate: Date;
    sellDate: Date;
    userDto: UserDto;
}

export interface TradeRequest {
    stockSymbol: string;
    buyPrice: number;
    sellPrice: number;
    quantity: number;
    buyDate: Date;
    sellDate: Date;
    stockDto: StockDto;
}

export interface PasswordResetToken extends AbstractEntity {
    token: string;
    emailSent: boolean;
    expiresAt: Date;
    user: User;
    expired: boolean;
}

export interface User extends AbstractEntity, UserDetails {
    email: string;
    firstName: string;
    lastName: string;
    verified: boolean;
    profileImageUrl: string;
    role: Role;
    verificationCode: VerificationCode;
    connectedAccounts: UserConnectedAccount[];
    watchlists: Watchlist[];
    trades: Trade[];
    portfolios: Portfolio[];
}

export interface UserConnectedAccount extends AbstractEntity {
    provider: string;
    providerId: string;
    connectedAt: Date;
    user: User;
}

export interface VerificationCode extends AbstractEntity {
    code: string;
    emailSent: boolean;
    user: User;
}

export interface CreateUserRequest {
    email: string;
    password: string;
    passwordConfirmation: string;
    firstName?: string;
    lastName?: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface UpdateUserPasswordRequest {
    oldPassword: string;
    password: string;
    confirmPassword: string;
    passwordResetToken: string;
}

export interface UpdateUserRequest {
    firstName: string;
    lastName: string;
}

export interface UserDto {
    id: number;
    email: string;
}

export interface UserResponse {
    id: number;
    role: Role;
    firstName?: string;
    lastName?: string;
    email: string;
    profileImageUrl?: string;
    connectedAccounts: ConnectedAccountResponse[];
    authorities: string[];
}

export interface Watchlist extends AbstractEntity {
    name: string;
    user: User;
    stocks: Stock[];
}

export interface WatchlistDto {
    id: number;
    name: string;
    userDto: UserDto;
    stockIds: number[];
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AbstractEntity {
    id: number;
}

export interface GrantedAuthority extends Serializable {
    authority: string;
}

export interface UserDetails extends Serializable {
    password: string;
    enabled: boolean;
    username: string;
    authorities: GrantedAuthority[];
    accountNonLocked: boolean;
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
}

export interface MultipartFile extends InputStreamSource {
    contentType: string;
    name: string;
    bytes: number[];
    empty: boolean;
    resource: Resource;
    size: number;
    originalFilename: string;
}

export interface RedirectView extends AbstractUrlBasedView, SmartView {
    hosts: string[];
    propagateQueryProperties: boolean;
    servletContext: ServletContext;
    exposeContextBeansAsAttributes: boolean;
    exposedContextBeanNames: string[];
    contextRelative: boolean;
    http10Compatible: boolean;
    exposeModelAttributes: boolean;
    encodingScheme: string;
    statusCode: HttpStatus;
    expandUriTemplateVariables: boolean;
    propagateQueryParams: boolean;
    attributesCSV: string;
    attributes: { [index: string]: any };
}

export interface ConnectedAccountResponse {
    provider: string;
    connectedAt: Date;
}

export interface PagedResponse<T> {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    data: T[];
}

export interface Serializable {
}

export interface Resource extends InputStreamSource {
    open: boolean;
    file: File;
    readable: boolean;
    url: URL;
    description: string;
    uri: URI;
    filename: string;
}

export interface InputStream extends Closeable {
}

export interface InputStreamSource {
    inputStream: InputStream;
}

export interface ApplicationContext extends EnvironmentCapable, ListableBeanFactory, HierarchicalBeanFactory, MessageSource, ApplicationEventPublisher, ResourcePatternResolver {
    parent: ApplicationContext;
    id: string;
    displayName: string;
    startupDate: number;
    autowireCapableBeanFactory: AutowireCapableBeanFactory;
    applicationName: string;
}

export interface ServletContext {
    classLoader: ClassLoader;
    majorVersion: number;
    minorVersion: number;
    attributeNames: Enumeration<string>;
    contextPath: string;
    /**
     * @deprecated
     */
    servletNames: Enumeration<string>;
    serverInfo: string;
    sessionTimeout: number;
    /**
     * @deprecated
     */
    servlets: Enumeration<Servlet>;
    effectiveMinorVersion: number;
    effectiveMajorVersion: number;
    initParameterNames: Enumeration<string>;
    servletContextName: string;
    servletRegistrations: { [index: string]: ServletRegistration };
    filterRegistrations: { [index: string]: FilterRegistration };
    sessionCookieConfig: SessionCookieConfig;
    jspConfigDescriptor: JspConfigDescriptor;
    virtualServerName: string;
    effectiveSessionTrackingModes: SessionTrackingMode[];
    requestCharacterEncoding: string;
    responseCharacterEncoding: string;
    defaultSessionTrackingModes: SessionTrackingMode[];
}

export interface AbstractUrlBasedView extends AbstractView, InitializingBean {
    url: string;
}

export interface SmartView extends View {
    redirectView: boolean;
}

export interface File extends Serializable, Comparable<File> {
}

export interface URL extends Serializable {
}

export interface URI extends Comparable<URI>, Serializable {
}

export interface Closeable extends AutoCloseable {
}

export interface AutowireCapableBeanFactory extends BeanFactory {
}

export interface Environment extends PropertyResolver {
    activeProfiles: string[];
    defaultProfiles: string[];
}

export interface BeanFactory {
}

export interface ClassLoader {
}

export interface EnvironmentCapable {
    environment: Environment;
}

export interface ListableBeanFactory extends BeanFactory {
    beanDefinitionNames: string[];
    beanDefinitionCount: number;
}

export interface HierarchicalBeanFactory extends BeanFactory {
    parentBeanFactory: BeanFactory;
}

export interface MessageSource {
}

export interface ApplicationEventPublisher {
}

export interface ResourcePatternResolver extends ResourceLoader {
}

export interface Enumeration<E> {
}

export interface Servlet {
    servletConfig: ServletConfig;
    servletInfo: string;
}

export interface ServletRegistration extends Registration {
    runAsRole: string;
    mappings: string[];
}

export interface FilterRegistration extends Registration {
    servletNameMappings: string[];
    urlPatternMappings: string[];
}

export interface SessionCookieConfig {
    name: string;
    path: string;
    comment: string;
    secure: boolean;
    maxAge: number;
    domain: string;
    httpOnly: boolean;
}

export interface JspConfigDescriptor {
    taglibs: TaglibDescriptor[];
    jspPropertyGroups: JspPropertyGroupDescriptor[];
}

export interface AbstractView extends WebApplicationObjectSupport, View, BeanNameAware {
    requestContextAttribute: string;
    staticAttributes: { [index: string]: any };
    exposePathVariables: boolean;
    beanName: string;
    attributesMap: { [index: string]: any };
}

export interface InitializingBean {
}

export interface View {
    contentType: string;
}

export interface AutoCloseable {
}

export interface PropertyResolver {
}

export interface ResourceLoader {
    classLoader: ClassLoader;
}

export interface ServletConfig {
    servletContext: ServletContext;
    servletName: string;
    initParameterNames: Enumeration<string>;
}

export interface Registration {
    name: string;
    className: string;
    initParameters: { [index: string]: string };
}

export interface TaglibDescriptor {
    taglibLocation: string;
    taglibURI: string;
}

export interface JspPropertyGroupDescriptor {
    buffer: string;
    isXml: string;
    urlPatterns: string[];
    includePreludes: string[];
    includeCodas: string[];
    pageEncoding: string;
    elIgnored: string;
    errorOnUndeclaredNamespace: string;
    scriptingInvalid: string;
    defaultContentType: string;
    deferredSyntaxAllowedAsLiteral: string;
    trimDirectiveWhitespaces: string;
}

export interface WebApplicationObjectSupport extends ApplicationObjectSupport, ServletContextAware {
}

export interface BeanNameAware extends Aware {
}

export interface Comparable<T> {
}

export interface ApplicationObjectSupport extends ApplicationContextAware {
    applicationContext: ApplicationContext;
}

export interface ServletContextAware extends Aware {
}

export interface Aware {
}

export interface ApplicationContextAware extends Aware {
}

export interface HttpClient {

    request<R>(requestConfig: { method: string; url: string; queryParams?: any; data?: any; copyFn?: (data: R) => R; }): RestResponse<R>;
}

export class RestApplicationClient {

    constructor(protected httpClient: HttpClient) {
    }

    /**
     * HTTP GET /api/admin/users
     * Java method: com.example.backend.admin.controller.AdminUsersController.admin_getUsers
     */
    admin_getUsers(queryParams?: { page?: number; }): RestResponse<PagedResponse<UserResponse>> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/admin/users`, queryParams: queryParams });
    }

    /**
     * HTTP GET /api/auth/csrf
     * Java method: com.example.backend.auth.controller.AuthController.csrf
     */
    csrf(): RestResponse<any> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/auth/csrf` });
    }

    /**
     * HTTP POST /api/auth/login
     * Java method: com.example.backend.auth.controller.AuthController.login
     */
    login(body: LoginRequest): RestResponse<any> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/auth/login`, data: body });
    }

    /**
     * HTTP POST /api/auth/logout
     * Java method: com.example.backend.auth.controller.AuthController.logout
     */
    logout(): RestResponse<void> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/auth/logout` });
    }

    /**
     * HTTP GET /api/auth/me
     * Java method: com.example.backend.auth.controller.AuthController.getSession
     */
    getSession(): RestResponse<UserResponse> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/auth/me` });
    }

    /**
     * HTTP POST /api/notifications/delivery/{id}
     * Java method: com.example.backend.pushNotifications.NotificationsController.pushNotificationDelivery
     */
    pushNotificationDelivery(id: number): RestResponse<void> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/notifications/delivery/${id}` });
    }

    /**
     * HTTP POST /api/notifications/denied
     * Java method: com.example.backend.pushNotifications.NotificationsController.pushNotificationRequestDenied
     */
    pushNotificationRequestDenied(request: NotificationPermissionRequest): RestResponse<void> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/notifications/denied`, data: request });
    }

    /**
     * HTTP POST /api/notifications/notify
     * Java method: com.example.backend.pushNotifications.NotificationsController.pushNotificationNotify
     */
    pushNotificationNotify(request: SendNotificationRequest): RestResponse<void> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/notifications/notify`, data: request });
    }

    /**
     * HTTP GET /api/notifications/stats/delivery
     * Java method: com.example.backend.pushNotifications.NotificationsController.getNotificationDeliveryStats
     */
    getNotificationDeliveryStats(queryParams?: { from?: Date; to?: Date; }): RestResponse<NotificationsByDate[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/notifications/stats/delivery`, queryParams: queryParams });
    }

    /**
     * HTTP GET /api/notifications/stats/subscriptions
     * Java method: com.example.backend.pushNotifications.NotificationsController.getNotificationSubscriptionStats
     */
    getNotificationSubscriptionStats(queryParams?: { from?: Date; to?: Date; }): RestResponse<NotificationSubscribersByDate[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/notifications/stats/subscriptions`, queryParams: queryParams });
    }

    /**
     * HTTP POST /api/notifications/subscribe
     * Java method: com.example.backend.pushNotifications.NotificationsController.pushNotificationSubscribe
     */
    pushNotificationSubscribe(request: SubscriptionRequest): RestResponse<void> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/notifications/subscribe`, data: request });
    }

    /**
     * HTTP POST /api/portfolio
     * Java method: com.example.backend.portfolio.controller.PortfolioController.createPortfolio
     */
    createPortfolio(portfolioDto: PortfolioDto): RestResponse<PortfolioDto> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/portfolio`, data: portfolioDto });
    }

    /**
     * HTTP GET /api/portfolio/defaultPortfolio
     * Java method: com.example.backend.portfolio.controller.PortfolioController.getDefaultPortfolio
     */
    getDefaultPortfolio(): RestResponse<PortfolioDto> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/portfolio/defaultPortfolio` });
    }

    /**
     * HTTP GET /api/portfolio/portfolios
     * Java method: com.example.backend.portfolio.controller.PortfolioController.getUserPortfolio
     */
    getUserPortfolio(): RestResponse<PortfolioDto[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/portfolio/portfolios` });
    }

    /**
     * HTTP GET /api/portfolio/unrealizedGain/{id}
     * Java method: com.example.backend.portfolio.controller.PortfolioController.calculateUnrealizedGain
     */
    calculateUnrealizedGain(id: number): RestResponse<number> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/portfolio/unrealizedGain/${id}` });
    }

    /**
     * HTTP DELETE /api/portfolio/{id}
     * Java method: com.example.backend.portfolio.controller.PortfolioController.deletePortfolio
     */
    deletePortfolio(id: number): RestResponse<PortfolioDto> {
        return this.httpClient.request({ method: "DELETE", url: uriEncoding`api/portfolio/${id}` });
    }

    /**
     * HTTP GET /api/portfolio/{id}
     * Java method: com.example.backend.portfolio.controller.PortfolioController.getPortfolioById
     */
    getPortfolioById(id: number): RestResponse<PortfolioDto> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/portfolio/${id}` });
    }

    /**
     * HTTP POST /api/portfolioItem
     * Java method: com.example.backend.portfolio.controller.PortfolioItemController.createPortfolioItem
     */
    createPortfolioItem(itemDto: PortfolioItemDto): RestResponse<PortfolioItemDto> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/portfolioItem`, data: itemDto });
    }

    /**
     * HTTP PUT /api/portfolioItem
     * Java method: com.example.backend.portfolio.controller.PortfolioItemController.editPortfolioItem
     */
    editPortfolioItem(itemDto: PortfolioItemDto): RestResponse<PortfolioItemDto> {
        return this.httpClient.request({ method: "PUT", url: uriEncoding`api/portfolioItem`, data: itemDto });
    }

    /**
     * HTTP GET /api/portfolioItem/byPortfolio/{portfolioId}
     * Java method: com.example.backend.portfolio.controller.PortfolioItemController.getPortfolioItems
     */
    getPortfolioItems(portfolioId: number): RestResponse<PortfolioItemDto[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/portfolioItem/byPortfolio/${portfolioId}` });
    }

    /**
     * HTTP GET /api/portfolioItem/item/{itemId}
     * Java method: com.example.backend.portfolio.controller.PortfolioItemController.getPortfolioItem
     */
    getPortfolioItem(itemId: number): RestResponse<PortfolioItemDto> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/portfolioItem/item/${itemId}` });
    }

    /**
     * HTTP DELETE /api/portfolioItem/{itemId}
     * Java method: com.example.backend.portfolio.controller.PortfolioItemController.deletePortfolioItem
     */
    deletePortfolioItem(itemId: number): RestResponse<void> {
        return this.httpClient.request({ method: "DELETE", url: uriEncoding`api/portfolioItem/${itemId}` });
    }

    /**
     * HTTP POST /api/stock
     * Java method: com.example.backend.stock.StockController.createStock
     */
    createStock(createStockRequest: CreateStockRequest): RestResponse<StockDto> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/stock`, data: createStockRequest });
    }

    /**
     * HTTP GET /api/stock/all
     * Java method: com.example.backend.stock.StockController.getAllStocks
     */
    getAllStocks(): RestResponse<StockDto[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/stock/all` });
    }

    /**
     * HTTP GET /api/stock/byWatchlist/{watchlistId}
     * Java method: com.example.backend.stock.StockController.getStocksByWatchlistId
     */
    getStocksByWatchlistId(watchlistId: number): RestResponse<StockDto[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/stock/byWatchlist/${watchlistId}` });
    }

    /**
     * HTTP GET /api/stock/search/{symbol}
     * Java method: com.example.backend.stock.StockController.searchStocks
     */
    searchStocks(symbol: string): RestResponse<StockDto[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/stock/search/${symbol}` });
    }

    /**
     * HTTP POST /api/trade
     * Java method: com.example.backend.trade.TradeController.createTrade
     */
    createTrade(tradeRequest: TradeRequest): RestResponse<TradeDto> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/trade`, data: tradeRequest });
    }

    /**
     * HTTP GET /api/trade
     * Java method: com.example.backend.trade.TradeController.getTrades
     */
    getTrades(): RestResponse<TradeDto[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/trade` });
    }

    /**
     * HTTP POST /api/trade/buy
     * Java method: com.example.backend.trade.TradeController.createBuyTrade
     */
    createBuyTrade(tradeRequest: BuyTradeRequest): RestResponse<TradeDto> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/trade/buy`, data: tradeRequest });
    }

    /**
     * HTTP POST /api/trade/sell
     * Java method: com.example.backend.trade.TradeController.createSellTrade
     */
    createSellTrade(tradeRequest: SellTradeRequest): RestResponse<TradeDto> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/trade/sell`, data: tradeRequest });
    }

    /**
     * HTTP DELETE /api/trade/{id}
     * Java method: com.example.backend.trade.TradeController.deleteTrade
     */
    deleteTrade(id: number): RestResponse<TradeDto> {
        return this.httpClient.request({ method: "DELETE", url: uriEncoding`api/trade/${id}` });
    }

    /**
     * HTTP POST /api/users
     * Java method: com.example.backend.users.controller.UsersController.createUser
     */
    createUser(request: CreateUserRequest): RestResponse<UserResponse> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/users`, data: request });
    }

    /**
     * HTTP GET /api/users/byid/{id}
     * Java method: com.example.backend.users.controller.UsersController.getUserById
     */
    getUserById(id: number): RestResponse<User> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/users/byid/${id}` });
    }

    /**
     * HTTP POST /api/users/forgot-password
     * Java method: com.example.backend.users.controller.UsersController.forgotPassword
     */
    forgotPassword(req: ForgotPasswordRequest): RestResponse<void> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/users/forgot-password`, data: req });
    }

    /**
     * HTTP PATCH /api/users/password
     * Java method: com.example.backend.users.controller.UsersController.updatePassword
     */
    updatePassword(requestDTO: UpdateUserPasswordRequest): RestResponse<UserResponse> {
        return this.httpClient.request({ method: "PATCH", url: uriEncoding`api/users/password`, data: requestDTO });
    }

    /**
     * HTTP PATCH /api/users/reset-password
     * Java method: com.example.backend.users.controller.UsersController.resetPassword
     */
    resetPassword(requestDTO: UpdateUserPasswordRequest): RestResponse<void> {
        return this.httpClient.request({ method: "PATCH", url: uriEncoding`api/users/reset-password`, data: requestDTO });
    }

    /**
     * HTTP GET /api/users/verify-email
     * Java method: com.example.backend.users.controller.UsersController.verifyEmail
     */
    verifyEmail(queryParams: { token: string; }): RestResponse<RedirectView> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/users/verify-email`, queryParams: queryParams });
    }

    /**
     * HTTP PUT /api/users/{id}
     * Java method: com.example.backend.users.controller.UsersController.updateUser
     */
    updateUser(id: string, request: UpdateUserRequest): RestResponse<UserResponse> {
        return this.httpClient.request({ method: "PUT", url: uriEncoding`api/users/${id}`, data: request });
    }

    /**
     * HTTP PATCH /api/users/{id}/profile-picture
     * Java method: com.example.backend.users.controller.UsersController.updateProfilePicture
     */
    updateProfilePicture(id: number, queryParams: { file: MultipartFile; }): RestResponse<UserResponse> {
        return this.httpClient.request({ method: "PATCH", url: uriEncoding`api/users/${id}/profile-picture`, queryParams: queryParams });
    }

    /**
     * HTTP POST /api/watchlist
     * Java method: com.example.backend.watchlist.WatchlistController.createWatchlist
     */
    createWatchlist(watchlistDto: WatchlistDto): RestResponse<WatchlistDto> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/watchlist`, data: watchlistDto });
    }

    /**
     * HTTP GET /api/watchlist
     * Java method: com.example.backend.watchlist.WatchlistController.getWatchlists
     */
    getWatchlists(): RestResponse<WatchlistDto[]> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/watchlist` });
    }

    /**
     * HTTP POST /api/watchlist/addStock/{watchlistId}
     * Java method: com.example.backend.watchlist.WatchlistController.addStockToWatchlist
     */
    addStockToWatchlist(watchlistId: number, newStock: StockDto): RestResponse<WatchlistDto> {
        return this.httpClient.request({ method: "POST", url: uriEncoding`api/watchlist/addStock/${watchlistId}`, data: newStock });
    }

    /**
     * HTTP PUT /api/watchlist/byName/{name}
     * Java method: com.example.backend.watchlist.WatchlistController.updateWatchlist
     */
    updateWatchlist(name: string, updatedWatchlist: WatchlistDto): RestResponse<WatchlistDto> {
        return this.httpClient.request({ method: "PUT", url: uriEncoding`api/watchlist/byName/${name}`, data: updatedWatchlist });
    }

    /**
     * HTTP GET /api/watchlist/name/{name}
     * Java method: com.example.backend.watchlist.WatchlistController.getWatchlistByName
     */
    getWatchlistByName(name: string): RestResponse<WatchlistDto> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/watchlist/name/${name}` });
    }

    /**
     * HTTP DELETE /api/watchlist/{id}
     * Java method: com.example.backend.watchlist.WatchlistController.deleteWatchlist
     */
    deleteWatchlist(id: number): RestResponse<WatchlistDto> {
        return this.httpClient.request({ method: "DELETE", url: uriEncoding`api/watchlist/${id}` });
    }

    /**
     * HTTP GET /api/watchlist/{id}
     * Java method: com.example.backend.watchlist.WatchlistController.getWatchlistById
     */
    getWatchlistById(id: number): RestResponse<WatchlistDto> {
        return this.httpClient.request({ method: "GET", url: uriEncoding`api/watchlist/${id}` });
    }

    /**
     * HTTP PUT /api/watchlist/{id}
     * Java method: com.example.backend.watchlist.WatchlistController.updateWatchlistById
     */
    updateWatchlistById(id: number, updatedWatchlist: WatchlistDto): RestResponse<WatchlistDto> {
        return this.httpClient.request({ method: "PUT", url: uriEncoding`api/watchlist/${id}`, data: updatedWatchlist });
    }

    /**
     * HTTP DELETE /api/watchlist/{watchlistId}/stocks/{stockId}
     * Java method: com.example.backend.watchlist.WatchlistController.removeStockFromWatchlist
     */
    removeStockFromWatchlist(watchlistId: number, stockId: number): RestResponse<WatchlistDto> {
        return this.httpClient.request({ method: "DELETE", url: uriEncoding`api/watchlist/${watchlistId}/stocks/${stockId}` });
    }
}

export type RestResponse<R> = Promise<R>;

export type RequestEvent = "ONLOAD" | "USER_INTERACTION";

export type DeniedReason = "NOT_SUPPORTED" | "NOT_GRANTED";

export type Role = "USER" | "ADMIN";

/**
 * Values:
 * - `CONTINUE`
 * - `SWITCHING_PROTOCOLS`
 * - `PROCESSING`
 * - `CHECKPOINT`
 * - `OK`
 * - `CREATED`
 * - `ACCEPTED`
 * - `NON_AUTHORITATIVE_INFORMATION`
 * - `NO_CONTENT`
 * - `RESET_CONTENT`
 * - `PARTIAL_CONTENT`
 * - `MULTI_STATUS`
 * - `ALREADY_REPORTED`
 * - `IM_USED`
 * - `MULTIPLE_CHOICES`
 * - `MOVED_PERMANENTLY`
 * - `FOUND`
 * - `MOVED_TEMPORARILY` - @deprecated
 * - `SEE_OTHER`
 * - `NOT_MODIFIED`
 * - `USE_PROXY` - @deprecated
 * - `TEMPORARY_REDIRECT`
 * - `PERMANENT_REDIRECT`
 * - `BAD_REQUEST`
 * - `UNAUTHORIZED`
 * - `PAYMENT_REQUIRED`
 * - `FORBIDDEN`
 * - `NOT_FOUND`
 * - `METHOD_NOT_ALLOWED`
 * - `NOT_ACCEPTABLE`
 * - `PROXY_AUTHENTICATION_REQUIRED`
 * - `REQUEST_TIMEOUT`
 * - `CONFLICT`
 * - `GONE`
 * - `LENGTH_REQUIRED`
 * - `PRECONDITION_FAILED`
 * - `PAYLOAD_TOO_LARGE`
 * - `REQUEST_ENTITY_TOO_LARGE` - @deprecated
 * - `URI_TOO_LONG`
 * - `REQUEST_URI_TOO_LONG` - @deprecated
 * - `UNSUPPORTED_MEDIA_TYPE`
 * - `REQUESTED_RANGE_NOT_SATISFIABLE`
 * - `EXPECTATION_FAILED`
 * - `I_AM_A_TEAPOT`
 * - `INSUFFICIENT_SPACE_ON_RESOURCE` - @deprecated
 * - `METHOD_FAILURE` - @deprecated
 * - `DESTINATION_LOCKED` - @deprecated
 * - `UNPROCESSABLE_ENTITY`
 * - `LOCKED`
 * - `FAILED_DEPENDENCY`
 * - `TOO_EARLY`
 * - `UPGRADE_REQUIRED`
 * - `PRECONDITION_REQUIRED`
 * - `TOO_MANY_REQUESTS`
 * - `REQUEST_HEADER_FIELDS_TOO_LARGE`
 * - `UNAVAILABLE_FOR_LEGAL_REASONS`
 * - `INTERNAL_SERVER_ERROR`
 * - `NOT_IMPLEMENTED`
 * - `BAD_GATEWAY`
 * - `SERVICE_UNAVAILABLE`
 * - `GATEWAY_TIMEOUT`
 * - `HTTP_VERSION_NOT_SUPPORTED`
 * - `VARIANT_ALSO_NEGOTIATES`
 * - `INSUFFICIENT_STORAGE`
 * - `LOOP_DETECTED`
 * - `BANDWIDTH_LIMIT_EXCEEDED`
 * - `NOT_EXTENDED`
 * - `NETWORK_AUTHENTICATION_REQUIRED`
 */
export type HttpStatus = "CONTINUE" | "SWITCHING_PROTOCOLS" | "PROCESSING" | "CHECKPOINT" | "OK" | "CREATED" | "ACCEPTED" | "NON_AUTHORITATIVE_INFORMATION" | "NO_CONTENT" | "RESET_CONTENT" | "PARTIAL_CONTENT" | "MULTI_STATUS" | "ALREADY_REPORTED" | "IM_USED" | "MULTIPLE_CHOICES" | "MOVED_PERMANENTLY" | "FOUND" | "MOVED_TEMPORARILY" | "SEE_OTHER" | "NOT_MODIFIED" | "USE_PROXY" | "TEMPORARY_REDIRECT" | "PERMANENT_REDIRECT" | "BAD_REQUEST" | "UNAUTHORIZED" | "PAYMENT_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "METHOD_NOT_ALLOWED" | "NOT_ACCEPTABLE" | "PROXY_AUTHENTICATION_REQUIRED" | "REQUEST_TIMEOUT" | "CONFLICT" | "GONE" | "LENGTH_REQUIRED" | "PRECONDITION_FAILED" | "PAYLOAD_TOO_LARGE" | "REQUEST_ENTITY_TOO_LARGE" | "URI_TOO_LONG" | "REQUEST_URI_TOO_LONG" | "UNSUPPORTED_MEDIA_TYPE" | "REQUESTED_RANGE_NOT_SATISFIABLE" | "EXPECTATION_FAILED" | "I_AM_A_TEAPOT" | "INSUFFICIENT_SPACE_ON_RESOURCE" | "METHOD_FAILURE" | "DESTINATION_LOCKED" | "UNPROCESSABLE_ENTITY" | "LOCKED" | "FAILED_DEPENDENCY" | "TOO_EARLY" | "UPGRADE_REQUIRED" | "PRECONDITION_REQUIRED" | "TOO_MANY_REQUESTS" | "REQUEST_HEADER_FIELDS_TOO_LARGE" | "UNAVAILABLE_FOR_LEGAL_REASONS" | "INTERNAL_SERVER_ERROR" | "NOT_IMPLEMENTED" | "BAD_GATEWAY" | "SERVICE_UNAVAILABLE" | "GATEWAY_TIMEOUT" | "HTTP_VERSION_NOT_SUPPORTED" | "VARIANT_ALSO_NEGOTIATES" | "INSUFFICIENT_STORAGE" | "LOOP_DETECTED" | "BANDWIDTH_LIMIT_EXCEEDED" | "NOT_EXTENDED" | "NETWORK_AUTHENTICATION_REQUIRED";

export type SessionTrackingMode = "COOKIE" | "URL" | "SSL";

function uriEncoding(template: TemplateStringsArray, ...substitutions: any[]): string {
    let result = "";
    for (let i = 0; i < substitutions.length; i++) {
        result += template[i];
        result += encodeURIComponent(substitutions[i]);
    }
    result += template[template.length - 1];
    return result;
}

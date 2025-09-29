import { ImageObject } from "./basic_model";

export class DataTable {

    name: string = '';

    private generate: boolean = false;

    private delete: boolean = false;
    private edit: boolean = false;

    private rows: Array<any> = [];
    private header: Array<DataHeader> = [];
    details: Array<any> = [];

    private show_detail: boolean = false;
    private active_row_id: number = 0;

    idKey: string = '';
    uidKey: string = '';

    loader: boolean = false;
    page_size: number = 0;

    sort_key: string = '';
    sort_order: string = 'asc'; // asc, desc

    // The number of elements in the page
    size: number = 0;
    // The total number of elements
    totalElements: number = 0;
    // The current page number
    currPage: number = 0;

    constructor(name: string = ''){
        this.name = name;
    }

    setUIDKey(key: string){
        this.uidKey = key;
    }

    setIdColumn(header: DataHeader){
        this.idKey = header.prop;
    }

    setSort(key: string, order: string){
        let header_item = this.header.find(item => item.prop == key);
        let new_key = (header_item?.form_url_tag == '' ? header_item.prop : header_item?.form_url_tag) || '';
        this.sort_key = new_key;
        this.sort_order = order;
    }

    setPage(offset: number, pageSize: number){
        this.page_size = pageSize;
        this.currPage = offset + 1;
    }

    clearAllFilter(){
        this.header.map(item => {
            item.clearFilter();
        });
    }

    setPageSize(size: number){
        this.page_size = size;
    }

    getPageSize(){
        return this.page_size;
    }

    showLoader(){
        this.loader = true;
    }

    hideLoader(){
        this.loader = false;
    }

    showDetail(row: any){
        let id = row[this.idKey];
        this.active_row_id = id;
        this.details = this.getDetails();
        this.show_detail = true;
    }

    hideDetail(){
        this.show_detail = false;
        this.active_row_id = 0;
    }

    isDetailActive(){
        return (this.show_detail && this.active_row_id > 0);
    }

    getUrl(url: string = ''){
        url = this.getPageUrl(url);
        url = this.getSortUrl(url);
        url = this.getSearchUrl(true, url);
        return url;
    }

    getSortUrl(url: string){
        let first_mark = (this.includeQuestionMark(url) ? '&' : '?');
        let return_url: string = '';
        if(this.sort_key != ''){
            return_url = `${url}${first_mark}sort=${this.sort_key}&sort_dir=${this.sort_order}`;
        }else{
            return_url = url;
        }
        return return_url;
    }

    includeQuestionMark(url: string){
        return url.includes("?");
    }

    getPageUrl(url: string){
        let first_mark = (this.includeQuestionMark(url) ? '&' : '?');
        let return_url: string = '';
        if(this.currPage > 0){
            return_url = `${url}${first_mark}page=${this.currPage - 1}`;
        }else{
            return_url = url;
        }

        return return_url;
    }

    getSearchUrl(object = false, url = ''){
        let query: string = '';
        let query_object: any = {};

        // create url
        this.header.map(item => {
            if(item.form == true){
                let tag = (item.form_url_tag == '' ? item.prop : item.form_url_tag);
                let connect_sign = (query == '' ? '?' : '&');
                if(item.form_type == DataHeaderType.string){
                    if(item.form_input_value != '') query = `${query}${connect_sign}${tag}=${item.form_input_value}`;
                }

                if(item.form_type == DataHeaderType.date || item.form_type == DataHeaderType.dateTime){
                    if(item.form_input_value != '') query = `${query}${connect_sign}${tag}=${item.form_input_value}`;
                }
            }
        });

        // create filter object 
        this.header.map(item => {
            if(item.form == true){
                if(item.form_input_value != ''){
                    let tag = (item.form_url_tag == '' ? item.prop : item.form_url_tag);
                    if(item.form_type == DataHeaderType.string){
                        query_object[tag] = {type: 'text', data: item.form_input_value};
                    }

                    if(item.form_type == DataHeaderType.date || item.form_type == DataHeaderType.dateTime){
                        query_object[tag] = {type: 'date', data: [item.form_input_value, item.form_input_value_second]};
                    }

                    if(item.form_type == DataHeaderType.function){
                        query_object[tag] = {type: 'function', data: item.form_input_value};
                    }
                }
            }
        });

        let query_object_str = JSON.stringify(query_object);

        if(object){
            if(Object.keys(query_object).length === 0 && query_object.constructor === Object){
                return url;
            }else{
                let first_mark = (this.includeQuestionMark(url) ? '&' : '?');
                return encodeURI(`${url}${first_mark}filter=${query_object_str}`);
            }
        }else{
            let first_mark = (this.includeQuestionMark(url) ? '&' : '?');
            return encodeURI(`${url}${first_mark}${query}`);
        }
    }

    getActiveColumn(){
        let return_item: any;
        this.header.map(item => {
            if(item.form_active_input || item.form_active_input_second){
                return_item = item;
            }
        });
        return return_item;
    }

    deActiveAllColumn(){
        this.header.map(item => {
            item.form_active_input = false;
            item.form_active_input_second = false;
        });
    }

    setDelete(state: boolean){
        this.delete = state;
    }

    setEdit(state: boolean){
        this.edit = state;
    }

    showDelete(){
        return this.delete;
    }

    showEdit(){
        return this.edit;
    }

    isGenerate(){
        return this.generate;
    }

    setGenerate(){
        this.generate = true;
    }

    addData(data: any){
        this.rows = data;
    }

    addHeader(title: string, prop: string, showTable: boolean, show: boolean, width = 100, sortable = true){
        let item = new DataHeader();
        item.create(title, prop, showTable, show, width, sortable);
        this.header.push(item);
        return item;
    }

    getObjectValByString(obj: any, str: string): any {
        if (typeof obj === "string") return obj;
        if (typeof obj === "number") return obj.toString();

        try{
            const fields = str.split(".");
            return this.getObjectValByString(obj[fields[0]], fields.slice(1).join("."));
        }catch{
            console.log(obj, str);
        }

    }

    getDetails(){
        let details: Array<any> = [];

        if(this.active_row_id > 0){
            let row = this.rows.find(row_item => row_item[this.idKey] == this.active_row_id);

            this.header.map(item => {
                if(item.details == true && item.prop != 'action_external'){
                    let title: string = (item.details_title == '' ? item.getName() : item.details_title);
                    let value = this.getObjectValByString(row, item.prop);
                    details.push({title: title, value: value, type: item.details_type, image: row[item.details_image_key]});
                }
            });
        }

        return details;
    }

    getHeader(){
        return this.header;
    }

    getHeaderByProp(prop: string): DataHeader | null{
        let return_item: DataHeader | null = null;
        this.header.map(item => {
            if(item.prop == prop){
                return_item = item;
            }
        });
        return return_item;
    }

    getData(){
        return this.rows;
    }

    getIdOfRow(row: any){
        return row[this.idKey];
    }

    getRowById(id: string){
        let return_data: any = null;
        this.getData().map(item => {
            if(item[this.idKey] == id){
                return_data = item;
            }
        });
        return return_data;
    }
}

export enum DataHeaderType{
    string = 0,
    date = 1,
    dateTime = 2,
    function = 3
}

export enum DataHeaderlocalDataClass{
    info = 'info',
    success = 'success',
    danger = 'danger'
}

export enum DataHeaderFunctionType{
    user = 'user',
    custom = 'custom',
    car = 'car',
    employee_request_type = 'employee_request_type',
    reservation_interval = 'reservation_interval',
    reservation_object = 'reservation_object',
}

export enum DataHeaderFunctionSelectType{
    single = 'single',
    multiple = 'multiple'
}

export enum DetailsType{
    string = 'string',
    image = 'image'
}

export class DataHeaderAction {
    title: string = '';
    icon: string = '';
    permission: boolean = false;
    color: string = 'primary';
}

class DataHeaderLocalData {
    title: string = '';
    value: string = '0';
    class: DataHeaderlocalDataClass = DataHeaderlocalDataClass.info;
}

class DataHeader {

    name: string = '';
    prop: string = '';
    show: boolean = true;
    showTable: boolean = true;
    width: number = 0;

    // filter/form parameters
    form: boolean = true;
    form_type: DataHeaderType = DataHeaderType.string;
    form_input_value: string = '';
    form_input_text: string = '';
    form_input_value_second: string = '';
    form_input_text_second: string = '';
    form_active_input: boolean = false;
    form_active_input_second: boolean = false; 

    form_url_tag: string = ''; // &username=xxx

    // details parameters
    details: boolean = true;
    details_title: string = '';
    details_type: DetailsType = DetailsType.string;
    details_image_key: string = '';

    local_function_data: Array<DataHeaderLocalData> = [];

    function_type: DataHeaderFunctionType | null = null;
    function_type_select: DataHeaderFunctionSelectType | null = null;

    sortable: boolean = true;

    construct(){
        //
    }

    getLocalFunctionDataById(id: string){
        let return_item: DataHeaderLocalData | null = null;
        this.local_function_data.map(item => {
            if(item.value == id){
                return_item = item;
            }
        });
        return return_item;
    }

    isEmpty(){
        if(this.form_input_value == '' && this.form_input_value_second == ''){
            return true;
        }else{
            return false;
        }
    }

    addLocalFunctionData(data: Array<DataHeaderLocalData>){
        this.local_function_data = data;
    }

    isSecondEmpty(){
        if(this.form_input_value_second == ''){
            return true;
        }else{
            return false;
        }
    }

    setFirstDate(frontend: string, value: string){
        this.form_input_text = frontend;
        this.form_input_value = value;
    }

    setSecondDate(frontend: string, value: string){
        this.form_input_text_second = frontend;
        this.form_input_value_second = value;
    }

    create(name: string, prop: string, showTable: boolean, show: boolean, width: number, sortable: boolean){
        this.name = name;
        this.prop = prop;
        this.showTable = showTable;
        this.show = show;
        this.width = width;
        this.sortable = sortable;
    }

    toggleShow(){
        this.show = !this.show;
    }

    setForm(state: boolean){
        this.form = state;
    }

    setDetail(state: boolean){
        this.details = state;
    }

    isDetail(){
        return this.details;
    }

    setFormParameters(state: boolean, type: DataHeaderType = DataHeaderType.string, form_url_tag: string = '', function_type: DataHeaderFunctionType | null = null, function_select_type: DataHeaderFunctionSelectType = DataHeaderFunctionSelectType.single){
        this.form = state;
        this.form_type = type;
        this.form_url_tag = form_url_tag;
        this.function_type = function_type;
        this.function_type_select = function_select_type;
    }

    setDetailParameters(state: boolean, title: string = '', type: DetailsType = DetailsType.string, image_key: string = ''){
        // icon , text1, text2...
        this.details = state;
        this.details_title = title;
        this.details_type = type;
        this.details_image_key = image_key;
    }

    /**
     * hidden from the table but still appeared like a hidden item
     */
    setShow(state: boolean){
        this.show = state;
    }

    /**
     * show in table generally like hidden or not hidden item
     */
    showInTable(state: boolean){
        this.showTable = state;
    }

    clearFilter(){
        this.form_input_text = '';
        this.form_input_value = '';
        this.form_input_text_second = '';
        this.form_input_value_second = '';
    }

    getProp(){
        return this.prop;
    }

    getName(){
        return this.name;
    }

    getShow(){
        return this.show;
    }

    getShowTable(){
        return this.showTable;
    }

    getFormType(){
        return this.form_type;
    }
}
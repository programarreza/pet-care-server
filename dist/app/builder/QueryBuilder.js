"use strict";
// /* eslint-disable prefer-const */
// import { FilterQuery, Query } from 'mongoose';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
        this.modelQuery = modelQuery;
        this.query = query;
    }
    // methods
    search(searchAbleFields) {
        var _a;
        if ((this === null || this === void 0 ? void 0 : this.query) && typeof ((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.searchTerm) === "string") {
            this.modelQuery = this === null || this === void 0 ? void 0 : this.modelQuery.find({
                $or: searchAbleFields.map((item) => {
                    var _a;
                    return ({
                        [item]: { $regex: (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.searchTerm, $options: "i" },
                    });
                }),
            });
        }
        return this;
    }
    filter() {
        const queryObj = Object.assign({}, this.query);
        const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        // Handle `availableAreas` as an array of values
        if (queryObj.availableAreas && typeof queryObj.availableAreas === "string") {
            const areasArray = queryObj.availableAreas.split(" ");
            queryObj.availableAreas = { $in: areasArray };
        }
        // Handle `availability` as an array of values
        if (queryObj.availability && typeof queryObj.availability === "string") {
            const availabilityArray = queryObj.availability.split(" ");
            queryObj.availability = { $in: availabilityArray };
        }
        // Handle `category` as an array of values (if applicable)
        if (queryObj.category && typeof queryObj.category === "string") {
            const categoryArray = queryObj.category.split(" ");
            queryObj.category = { $in: categoryArray };
        }
        this.modelQuery = this.modelQuery.find(queryObj);
        return this;
    }
    sort() {
        var _a, _b;
        let sort = "-createdAt";
        if ((this === null || this === void 0 ? void 0 : this.query) && typeof ((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.sort) === "string") {
            sort = ((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.sort).split(",").join(" ");
        }
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    paginate() {
        var _a, _b, _c;
        // limit section
        let limit = 6;
        if ((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.limit) {
            limit = this === null || this === void 0 ? void 0 : this.query.limit;
        }
        // const limitQuery = sortQuery.limit(limit);
        // skip section
        const page = (_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.page;
        let skip = 0;
        if ((_c = this === null || this === void 0 ? void 0 : this.query) === null || _c === void 0 ? void 0 : _c.page) {
            skip = (Number(page) - 1) * limit;
        }
        this.modelQuery = this.modelQuery.limit(limit).skip(skip);
        return this;
    }
    fields() {
        var _a, _b;
        // it  should be get   ..fields:"name email gender"
        let fields = "-__v";
        if ((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.fields) {
            fields = ((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.fields).split(",").join(" ");
        }
        if (this === null || this === void 0 ? void 0 : this.modelQuery) {
            this.modelQuery.select(fields);
        }
        return this;
    }
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const totalQueries = this.modelQuery.getFilter();
            const total = yield this.modelQuery.model.countDocuments(totalQueries);
            const page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
            const limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
            const totalPage = Math.ceil(total / limit);
            return {
                page,
                limit,
                total,
                totalPage,
            };
        });
    }
}
exports.default = QueryBuilder;

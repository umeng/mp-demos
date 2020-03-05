module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { __MODS__[modId].m.exports.__proto__ = m.exports.__proto__; Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; var desp = Object.getOwnPropertyDescriptor(m.exports, k); if(desp && desp.configurable) Object.defineProperty(m.exports, k, { set: function(val) { __MODS__[modId].m.exports[k] = val; }, get: function() { return __MODS__[modId].m.exports[k]; } }); }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1582182478298, function(require, module, exports) {
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./mpserverless"], factory);
    }
})(function (require, exports) {
    
    Object.defineProperty(exports, "__esModule", { value: true });
    var mpserverless_1 = require("./mpserverless");
    exports.MPServerless = mpserverless_1.MPServerless;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSwrQ0FBOEM7SUFBckMsc0NBQUEsWUFBWSxDQUFBIn0=
}, function(modId) {var map = {"./mpserverless":1582182478299}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582182478299, function(require, module, exports) {
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "@ant-basement/core", "@ant-basement/services", "./transport", "mime/lite", "./error", "./network"], factory);
    }
})(function (require, exports) {
    
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@ant-basement/core");
    const services_1 = require("@ant-basement/services");
    const transport_1 = require("./transport");
    const lite_1 = tslib_1.__importDefault(require("mime/lite"));
    const error_1 = require("./error");
    const network_1 = require("./network");
    class MiniProgramFileService extends services_1.FileService {
        async uploadFile(options) {
            core_1.assert(options.filePath && typeof options.filePath === 'string', 'missing options.filePath');
            const relativePath = options.filePath.replace(/(.*):\/\//, '');
            const extension = relativePath.split('.').pop();
            core_1.assert(core_1.WHITELIST_EXTENSIONS.includes(extension.toLowerCase()), `目前不支持 ${extension} 类型文件`);
            const meta = Object.keys(options.meta || {}).reduce((accu, key) => {
                accu[`x-oss-meta-${key}`] = options.meta[key];
                return accu;
            }, {});
            const headers = options.headers ? core_1.OSSUploadHeaderList.reduce((accu, key) => {
                const fieldName = key.replace(/\-[A-Z]/g, match => match[1]).replace(/^[A-Z]/, match => match.toLowerCase());
                if (options.headers.hasOwnProperty(fieldName))
                    accu[key] = options.headers[fieldName];
                return accu;
            }, {}) : {};
            let fileSize = options.fileSize;
            const getFileInfo = this.transport.getFileInfo;
            if (!fileSize && getFileInfo) {
                const fileInfo = await getFileInfo({
                    filePath: options.filePath,
                });
                fileSize = fileInfo.size;
            }
            let imageExt = options.extension;
            const getImageInfo = this.transport.getImageInfo;
            if (!imageExt && getImageInfo) {
                const imageInfo = await getImageInfo({
                    src: options.filePath,
                });
                imageExt = imageInfo.type;
            }
            const uploadRes = await this.getOSSUploadOptionsFromPath(relativePath, options.path, fileSize);
            if (uploadRes.error) {
                throw new error_1.MPServerlessClientError(core_1.ErrorName.INTERFACE_ERROR, core_1.ErrorCode.INTERFACE_RESPONSE_FAILED, core_1.ErrorType.COMMON_ERROR, uploadRes.error.message);
            }
            const uploadOptions = core_1.OSSUploadResponseFormat(uploadRes.result);
            await this.uploadFileToOSS(options, uploadOptions, headers, meta);
            await this.reportOSSUpload(uploadOptions.id, lite_1.default.getType(imageExt));
            return {
                fileUrl: `https://${uploadOptions.host}/${uploadOptions.key}`,
                filePath: uploadOptions.key,
            };
        }
        async uploadFileToOSS(fileUploadOptions, ossUploadOptions, headers, meta) {
            const options = ['key', 'policy', 'Signature', 'OSSAccessKeyId'].reduce((accu, key) => {
                accu[key] = ossUploadOptions[key];
                return accu;
            }, ossUploadOptions);
            const uploadHeader = {};
            if (fileUploadOptions.extension) {
                const contentType = lite_1.default.getType(fileUploadOptions.extension);
                if (!contentType) {
                    throw new error_1.MPServerlessClientError(core_1.ErrorName.VALIDATION_ERROR, core_1.ErrorCode.VALIDATION_FAILED, core_1.ErrorType.COMMON_ERROR, '文件扩展错误，无法解析正确的 MIME');
                }
                uploadHeader['Content-Type'] = contentType;
            }
            headers['Cache-Control'] = 'max-age=2592000';
            await this.transport.upload(`https://${ossUploadOptions.host}`, Object.assign({ success_action_status: 200 }, headers, meta, options), 'file', fileUploadOptions.filePath, uploadHeader);
        }
    }
    class MPServerless extends core_1.Basement {
        constructor(appGlobal, options) {
            super({ ...options, httpClient: appGlobal, httpTransport: transport_1.MiniProgramHTTPTransport, logger: appGlobal.logger });
            core_1.assert(options.clientSecret, 'clientSecret is required');
            core_1.assert(options.appId, 'appId is required');
            this.db = new services_1.DbService(this.transport);
            this.user = new services_1.AuthService(this.transport);
            this.file = new MiniProgramFileService(this.transport);
            this.function = new services_1.FunctionService(this.transport);
            this.network = new network_1.NetworkService(this.transport);
            this.user.authorize = async (options) => {
                const hasToken = this.transport.hasToken();
                if (options.authType === transport_1.AuthType.ANONYMOUS) {
                    const token = await this.transport.anonymousAuthorize(options);
                    if (token) {
                        return {
                            success: true,
                        };
                    }
                    return {
                        success: false,
                    };
                }
                else if (!hasToken || hasToken && this.transport.authType !== options.authType) {
                    const token = await this.transport.authorize(options);
                    if (token) {
                        return {
                            success: true,
                        };
                    }
                    return {
                        success: false,
                    };
                }
            };
        }
        get version() {
            return VERSION;
        }
        get ua() {
            return PKGUA;
        }
        createTransport(options) {
            super.createTransport(options);
            this.transport.setAppSecret(options.clientSecret).setUA(this.ua);
        }
    }
    exports.MPServerless = MPServerless;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXBzZXJ2ZXJsZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21wc2VydmVybGVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBQSw2Q0FhNEI7SUFDNUIscURBRWdDO0lBQ2hDLDJDQUFtRjtJQUNuRiw2REFBNkI7SUFDN0IsbUNBQWtEO0lBQ2xELHVDQUVtQjtJQUVuQixNQUFNLHNCQUF1QixTQUFRLHNCQUFXO1FBTXZDLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBMEI7WUFDaEQsYUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1lBRTdGLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMvRCxNQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2hELGFBQU0sQ0FBQywyQkFBb0IsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsU0FBUyxTQUFTLE9BQU8sQ0FBQyxDQUFDO1lBRTFGLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUU7Z0JBQ2hFLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDOUMsT0FBTyxJQUFJLENBQUM7WUFDZCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDUCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQywwQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUU7Z0JBQ3pFLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO2dCQUM3RyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQztvQkFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDdEYsT0FBTyxJQUFJLENBQUM7WUFDZCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUVaLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFDaEMsTUFBTSxXQUFXLEdBQUksSUFBSSxDQUFDLFNBQXNDLENBQUMsV0FBVyxDQUFDO1lBQzdFLElBQUksQ0FBQyxRQUFRLElBQUksV0FBVyxFQUFFO2dCQUM1QixNQUFNLFFBQVEsR0FBRyxNQUFNLFdBQVcsQ0FBQztvQkFDakMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO2lCQUMzQixDQUFDLENBQUM7Z0JBQ0gsUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7YUFDMUI7WUFFRCxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO1lBQ2pDLE1BQU0sWUFBWSxHQUFJLElBQUksQ0FBQyxTQUFzQyxDQUFDLFlBQVksQ0FBQztZQUMvRSxJQUFJLENBQUMsUUFBUSxJQUFJLFlBQVksRUFBRTtnQkFDN0IsTUFBTSxTQUFTLEdBQUcsTUFBTSxZQUFZLENBQUM7b0JBQ25DLEdBQUcsRUFBRSxPQUFPLENBQUMsUUFBUTtpQkFDdEIsQ0FBQyxDQUFDO2dCQUNILFFBQVEsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDO2FBQzNCO1lBR0QsTUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFJLENBQUMsMkJBQTJCLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDL0YsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO2dCQUNuQixNQUFNLElBQUksK0JBQXVCLENBQy9CLGdCQUFTLENBQUMsZUFBZSxFQUN6QixnQkFBUyxDQUFDLHlCQUF5QixFQUNuQyxnQkFBUyxDQUFDLFlBQVksRUFDdEIsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQ3hCLENBQUM7YUFDSDtZQUNELE1BQU0sYUFBYSxHQUFHLDhCQUF1QixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVoRSxNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFbEUsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsY0FBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBRXJFLE9BQU87Z0JBQ0wsT0FBTyxFQUFFLFdBQVcsYUFBYSxDQUFDLElBQUksSUFBSSxhQUFhLENBQUMsR0FBRyxFQUFFO2dCQUM3RCxRQUFRLEVBQUUsYUFBYSxDQUFDLEdBQUc7YUFDNUIsQ0FBQztRQUNKLENBQUM7UUFFTyxLQUFLLENBQUMsZUFBZSxDQUMzQixpQkFBb0MsRUFDcEMsZ0JBQWtDLEVBQ2xDLE9BQXlCLEVBQ3pCLElBQTJCO1lBRTNCLE1BQU0sT0FBTyxHQUFHLENBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLENBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUU7Z0JBQ3RGLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsT0FBTyxJQUFJLENBQUM7WUFDZCxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUNyQixNQUFNLFlBQVksR0FBMEIsRUFBRSxDQUFDO1lBRS9DLElBQUksaUJBQWlCLENBQUMsU0FBUyxFQUFFO2dCQUMvQixNQUFNLFdBQVcsR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM5RCxJQUFJLENBQUMsV0FBVyxFQUFFO29CQUNoQixNQUFNLElBQUksK0JBQXVCLENBQy9CLGdCQUFTLENBQUMsZ0JBQWdCLEVBQzFCLGdCQUFTLENBQUMsaUJBQWlCLEVBQzNCLGdCQUFTLENBQUMsWUFBWSxFQUN0QixxQkFBcUIsQ0FDdEIsQ0FBQztpQkFDSDtnQkFDRCxZQUFZLENBQUMsY0FBYyxDQUFDLEdBQUcsV0FBVyxDQUFDO2FBQzVDO1lBRUQsT0FBTyxDQUFDLGVBQWUsQ0FBQyxHQUFHLGlCQUFpQixDQUFDO1lBQzdDLE1BQU8sSUFBSSxDQUFDLFNBQXNDLENBQUMsTUFBTSxDQUN2RCxXQUFXLGdCQUFnQixDQUFDLElBQUksRUFBRSxFQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUscUJBQXFCLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsRUFDckUsTUFBTSxFQUNOLGlCQUFpQixDQUFDLFFBQVEsRUFDMUIsWUFBWSxDQUNiLENBQUM7UUFDSixDQUFDO0tBQ0Y7SUFNRCxNQUFhLFlBQWEsU0FBUSxlQUFJO1FBUXBDLFlBQVksU0FBYyxFQUFFLE9BQXdCO1lBQ2xELEtBQUssQ0FBQyxFQUFFLEdBQUcsT0FBTyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLG9DQUF3QixFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUVoSCxhQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1lBQ3pELGFBQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFFM0MsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLG9CQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxzQkFBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQWdCLENBQUM7WUFDM0QsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLHNCQUFzQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2RCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksMEJBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLHdCQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRWxELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssRUFBRSxPQUF5QixFQUFnQyxFQUFFO2dCQUN0RixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQU0zQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssb0JBQVEsQ0FBQyxTQUFTLEVBQUU7b0JBQzNDLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDL0QsSUFBSSxLQUFLLEVBQUU7d0JBQ1QsT0FBTzs0QkFDTCxPQUFPLEVBQUUsSUFBSTt5QkFDZCxDQUFDO3FCQUNIO29CQUNELE9BQU87d0JBQ0wsT0FBTyxFQUFFLEtBQUs7cUJBQ2YsQ0FBQztpQkFDSDtxQkFBTSxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsUUFBUSxFQUFFO29CQUNoRixNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN0RCxJQUFJLEtBQUssRUFBRTt3QkFDVCxPQUFPOzRCQUNMLE9BQU8sRUFBRSxJQUFJO3lCQUNkLENBQUM7cUJBQ0g7b0JBQ0QsT0FBTzt3QkFDTCxPQUFPLEVBQUUsS0FBSztxQkFDZixDQUFDO2lCQUNIO1lBQ0gsQ0FBQyxDQUFDO1FBQ0osQ0FBQztRQU1ELElBQVcsT0FBTztZQUNoQixPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDO1FBS0QsSUFBYyxFQUFFO1lBQ2QsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRVMsZUFBZSxDQUFDLE9BQXdCO1lBQ2hELEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbkUsQ0FBQztLQUNGO0lBdEVELG9DQXNFQyJ9
}, function(modId) { var map = {"./transport":1582182478300,"./error":1582182478302,"./network":1582182478303}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582182478300, function(require, module, exports) {
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@ant-basement/core", "./codec", "./error"], factory);
    }
})(function (require, exports) {
    
    Object.defineProperty(exports, "__esModule", { value: true });
    const core_1 = require("@ant-basement/core");
    const codec_1 = require("./codec");
    const error_1 = require("./error");
    var AuthType;
    (function (AuthType) {
        AuthType["ANONYMOUS"] = "anonymous";
        AuthType["DEFAULT"] = "";
    })(AuthType = exports.AuthType || (exports.AuthType = {}));
    class MiniProgramHTTPTransport extends core_1.HTTPTransport {
        constructor(endpoint, library) {
            super(endpoint, library);
            this.scope = 'auth_user';
            core_1.assert(library.uploadFile, 'missing uploadFile');
            core_1.assert(library.getAuthCode, 'missing getAuthCode');
            core_1.assert(library.request, 'missing request');
            this.uploadFile = this.wrap(library.uploadFile);
            this.getAuthCode = this.wrap(library.getAuthCode);
            this.httpRequest = this.wrap(library.request);
            if (library.getFileInfo) {
                this.getFileInfo = this.wrap(library.getFileInfo);
            }
            if (library.getImageInfo) {
                this.getImageInfo = this.wrap(library.getImageInfo);
            }
        }
        getEncoder() {
            return new codec_1.MiniProgramHTTPRequestEncoder(this.endpoint, this.spaceId);
        }
        async request(encoder, retried = false) {
            const cloned = encoder.clone();
            const token = await this.getAccessToken();
            encoder.setBodyField({
                token,
            });
            encoder.sign(this.appSecret);
            encoder.setBaseHeaders({
                'Content-Type': 'application/json',
                'x-basement-token': token,
            });
            if (this.ua) {
                encoder.setBaseHeaders({
                    'x-serverless-ua': this.ua,
                });
            }
            try {
                const encoded = encoder.encodeAsHTTPRequestObject({
                    timeout: this.timeout,
                    dataType: 'json',
                });
                this.logger.info('request encode data', encoded);
                const decoded = await this.httpRequest(encoded);
                return decoded;
            }
            catch (e) {
                this.logger.error('request error', e);
                const isUnAuthorized = e.error.code === 'GATEWAY_INVALID_TOKEN'
                    || e.error.code === 'InvalidParameter.InvalidToken' || e.status === core_1.HTTP_UNAUTHORIZED;
                if (isUnAuthorized) {
                    if (retried) {
                        throw new error_1.MPServerlessClientError(core_1.ErrorName.UNAUTHORIZED_ERROR, core_1.ErrorCode.AUTHENTICATION_FAILED, core_1.ErrorType.COMMON_ERROR, 'authentication failed');
                    }
                    await this.getAccessToken(true);
                    return await this.request(cloned, true);
                }
                if (e.error) {
                    throw e.error;
                }
                throw e;
            }
        }
        hasToken() {
            return !!this.accessToken;
        }
        get authType() {
            return this.currentAuthType;
        }
        async authorize(options) {
            this.pendingRequest = this
                .getAuthCode({ scopes: this.scope })
                .then((res) => {
                this.logger.info(`Request authcode is ${res.body.authCode || res.body.code} `);
                return res.body.authCode || res.body.code;
            })
                .then((authCode) => {
                const encoder = this.getEncoder();
                encoder.setBodyField({
                    method: 'serverless.auth.user.authorize',
                    params: {
                        authProvider: options.authProvider || 'alipay_openapi',
                        clientIdentifier: this.appId,
                        authCode,
                    },
                });
                encoder.sign(this.appSecret);
                encoder.setBaseHeaders({ 'Content-Type': 'application/json' });
                if (this.ua) {
                    encoder.setBaseHeaders({
                        'x-serverless-ua': this.ua,
                    });
                }
                const encoded = encoder.encodeAsHTTPRequestObject({
                    timeout: this.timeout,
                    dataType: 'json',
                });
                return this.httpRequest(encoded);
            })
                .then((res) => {
                this.logger.info('Request accessToken ' + (res.body.success ? 'success' : 'failed'));
                if (res.body && res.body.result) {
                    this.authorizeOptions = options;
                    this.accessToken = res.body.result.accessToken;
                    this.currentAuthType = AuthType.DEFAULT;
                }
                this.pendingRequest = null;
                return Promise.resolve(this.accessToken);
            });
            return this.pendingRequest;
        }
        async anonymousAuthorize(options) {
            const encoder = this.getEncoder();
            encoder.setBodyField({
                method: 'serverless.auth.user.anonymousAuthorize',
                params: {
                    clientIdentifier: this.appId,
                },
            });
            encoder.sign(this.appSecret);
            encoder.setBaseHeaders({ 'Content-Type': 'application/json' });
            if (this.ua) {
                encoder.setBaseHeaders({
                    'x-serverless-ua': this.ua,
                });
            }
            const encoded = encoder.encodeAsHTTPRequestObject({
                timeout: this.timeout,
                dataType: 'json',
            });
            this.pendingRequest = this.httpRequest(encoded)
                .then((res) => {
                this.logger.info('Request accessToken ' + (res.body.success ? 'success' : 'failed'));
                if (res.body && res.body.result) {
                    this.authorizeOptions = options;
                    this.accessToken = res.body.result.accessToken;
                    this.currentAuthType = AuthType.ANONYMOUS;
                }
                this.pendingRequest = null;
                return Promise.resolve(this.accessToken);
            });
            return this.pendingRequest;
        }
        async getAccessToken(refresh = false) {
            if (this.pendingRequest) {
                this.logger.info('getAccessToken: reuse');
                return this.pendingRequest;
            }
            if (!this.accessToken) {
                throw new error_1.MPServerlessClientError(core_1.ErrorName.UNAUTHORIZED_ERROR, core_1.ErrorCode.UNAUTHENTICATION, core_1.ErrorType.COMMON_ERROR, 'unauthentication, should use user.authorize / user.anonymousAuthorize first');
            }
            if (refresh && this.authorizeOptions) {
                this.logger.info('getAccessToken: start');
                if (this.authorizeOptions.authType === AuthType.ANONYMOUS) {
                    return this.anonymousAuthorize(this.authorizeOptions);
                }
                return this.authorize(this.authorizeOptions);
            }
            return this.accessToken;
        }
        async upload(host, formData, fileName, filePath, header) {
            this.logger.info('upload with params');
            this.logger.info(JSON.stringify(formData, null, 2));
            return await this.uploadFile({
                url: host,
                formData,
                fileName,
                name: fileName,
                filePath,
                fileType: 'image',
                header: {
                    ...header,
                    'X-OSS-server-side-encrpytion': 'AES256',
                },
            });
        }
        wrap(myMethod) {
            return args => {
                return new Promise((resolve, reject) => {
                    myMethod(Object.assign(args, {
                        complete: (res = {}) => {
                            this.logger.info('completed request');
                            this.logger.info(JSON.stringify(res, null, 2));
                            const decoder = new codec_1.MiniProgramHTTPResponseDecoder();
                            const response = decoder.decode(res);
                            if (response.error) {
                                return reject(response);
                            }
                            return resolve(response);
                        },
                    }));
                });
            };
        }
    }
    exports.MiniProgramHTTPTransport = MiniProgramHTTPTransport;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RyYW5zcG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBLDZDQVk0QjtJQUM1QixtQ0FPaUI7SUFDakIsbUNBQWtEO0lBY2xELElBQVksUUFHWDtJQUhELFdBQVksUUFBUTtRQUNsQixtQ0FBdUIsQ0FBQTtRQUN2Qix3QkFBWSxDQUFBO0lBQ2QsQ0FBQyxFQUhXLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBR25CO0lBRUQsTUFBYSx3QkFBeUIsU0FBUSxvQkFBYTtRQVl6RCxZQUNFLFFBQWdCLEVBQ2hCLE9BQVk7WUFFWixLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBZmpCLFVBQUssR0FBZSxXQUFXLENBQUM7WUFnQnhDLGFBQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLG9CQUFvQixDQUFDLENBQUM7WUFDakQsYUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUscUJBQXFCLENBQUMsQ0FBQztZQUNuRCxhQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBRTNDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzlDLElBQUksT0FBTyxDQUFDLFdBQVcsRUFBRTtnQkFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUNuRDtZQUNELElBQUksT0FBTyxDQUFDLFlB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
}, function(modId) { var map = {"./codec":1582182478301,"./error":1582182478302}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582182478301, function(require, module, exports) {
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "@ant-basement/core", "crypto-js/core", "crypto-js/hmac-md5", "util", "./error"], factory);
    }
})(function (require, exports) {
    
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const core_1 = require("@ant-basement/core");
    const core_2 = tslib_1.__importDefault(require("crypto-js/core"));
    const hmac_md5_1 = tslib_1.__importDefault(require("crypto-js/hmac-md5"));
    const util_1 = require("util");
    const error_1 = require("./error");
    class MiniProgramHTTPRequestEncoder extends core_1.HTTPRequestEncoder {
        constructor(endpoint, spaceId) {
            super(endpoint);
            this.spaceId = spaceId;
            this.prefix = core_1.PREFIX.CLIENT;
            this.serviceHeaders = {};
            this.setBodyField({
                spaceId,
            });
        }
        sign(clientSecret) {
            const { spaceId, method, params, token, userId } = this.body;
            const timestamp = Date.now();
            this.setBodyField({
                timestamp,
            });
            let signString = '';
            const signObject = {
                spaceId,
                timestamp,
                method,
                params: JSON.stringify(params),
                token,
                userId,
            };
            Object.keys(signObject).sort().forEach(key => {
                if (signObject[key]) {
                    signString = `${signString}&${key}=${signObject[key]}`;
                }
            });
            signString = signString.slice(1);
            const sign = hmac_md5_1.default(signString, clientSecret).toString(core_2.default.enc.Hex);
            this.setServerlessHeaders({ sign });
        }
        encodeAsHTTPRequestObject(additionalObject) {
            if (this.body.params) {
                this.body.params = JSON.stringify(this.body.params);
            }
            return {
                url: this.url,
                data: this.body,
                method: this.method,
                headers: this.headers,
                header: this.headers,
                dataType: 'json',
                ...additionalObject,
            };
        }
        clone() {
            const encoder = new MiniProgramHTTPRequestEncoder(this.endpoint, this.spaceId);
            encoder.setBodyField(this.body);
            encoder.setBaseHeaders(this.baseHeaders);
            encoder.setServerlessHeaders(this.serverlessHeaders);
            return encoder;
        }
    }
    exports.MiniProgramHTTPRequestEncoder = MiniProgramHTTPRequestEncoder;
    class MiniProgramHTTPResponseDecoder extends core_1.HTTPResponseDecoder {
        constructor() {
            super(...arguments);
            this.ERROR_CODES = [11, 12, 13, 14, 19, 20];
        }
        setStatusAndBody(status, body) {
            super.setStatusAndBody(status, body);
            if (this.ERROR_CODES.includes(status)) {
                this._error = error_1.MPServerlessClientError.from({
                    name: core_1.ErrorName.IDE_ERROR,
                    code: status.toString(),
                    type: core_1.ErrorType.IDE_ERROR,
                    message: 'request error from Alipay IDE',
                });
            }
        }
        decode(res) {
            this.setHeaders(res.headers || {});
            let body = res.data || res.body;
            if (typeof body === 'string') {
                body = JSON.parse(body);
            }
            if (body && body.data) {
                if (util_1.isNumber(body.data.affectedDocs)) {
                    body = Object.assign({}, body, {
                        ...body.data,
                    });
                }
                else if (Object.prototype.toString.call(body.data) === '[object Object]') {
                    body.result = Object.assign({}, body.data);
                }
                else if (Object.prototype.toString.call(body.data) === '[object Array]') {
                    [...body.result] = body.data;
                }
                else {
                    body.result = body.data;
                }
                delete body.data;
            }
            if (/^request:fail+/.test(res.errMsg)) {
                this.setErrorMessage(res.errMsg);
                return super.decode();
            }
            const responseErrorCode = parseInt(res.error, 10);
            if (responseErrorCode) {
                this.setStatusAndBody(responseErrorCode, body);
                return super.decode();
            }
            const responseErrorMessage = res.err;
            if (responseErrorMessage) {
                this.setErrorMessage(responseErrorMessage);
                return super.decode();
            }
            if (res instanceof Error) {
                this.setErrorObject(res);
                return super.decode();
            }
            if (body && typeof body.error === 'object') {
                this.setErrorObject(body.error);
                return super.decode();
            }
            const responseStatusCode = parseInt(res.status || res.statusCode, 10);
            if (responseStatusCode) {
                this.setStatusAndBody(responseStatusCode, body);
                return super.decode();
            }
            this.setStatusAndBody(200, res);
            return super.decode();
        }
    }
    exports.MiniProgramHTTPResponseDecoder = MiniProgramHTTPResponseDecoder;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29kZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQUEsNkNBUzRCO0lBQzVCLGtFQUFvQztJQUNwQywwRUFBeUM7SUFDekMsK0JBQWdDO0lBQ2hDLG1DQUFrRDtJQThCbEQsTUFBYSw2QkFBOEIsU0FBUSx5QkFBa0I7UUFTbkUsWUFBWSxRQUFnQixFQUFZLE9BQWU7WUFDckQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRHNCLFlBQU8sR0FBUCxPQUFPLENBQVE7WUFSN0MsV0FBTSxHQUFHLGFBQU0sQ0FBQyxNQUFNLENBQUM7WUFDdkIsbUJBQWMsR0FBMEIsRUFBRSxDQUFDO1lBVW5ELElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQ2hCLE9BQU87YUFDUixDQUFDLENBQUM7UUFDTCxDQUFDO1FBTU0sSUFBSSxDQUFDLFlBQW9CO1lBQzlCLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUM3RCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFDaEIsU0FBUzthQUNWLENBQUMsQ0FBQztZQUNILElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUNwQixNQUFNLFVBQVUsR0FBRztnQkFDakIsT0FBTztnQkFDUCxTQUFTO2dCQUNULE1BQU07Z0JBQ04sTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO2dCQUM5QixLQUFLO2dCQUNMLE1BQU07YUFDUCxDQUFDO1lBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzNDLElBQUksVUFBVSxDQUFDLEdB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
}, function(modId) { var map = {"./error":1582182478302}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582182478302, function(require, module, exports) {
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@ant-basement/core"], factory);
    }
})(function (require, exports) {
    
    Object.defineProperty(exports, "__esModule", { value: true });
    const core_1 = require("@ant-basement/core");
    class MPServerlessClientError extends core_1.BuiltInError {
        constructor(name, code, type, message) {
            super(message);
            this.name = name;
            this.code = code;
            this.type = type;
            this.message = message;
        }
        static from(raw) {
            return new MPServerlessClientError(raw.name, raw.code, raw.type, raw.message);
        }
    }
    exports.MPServerlessClientError = MPServerlessClientError;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSw2Q0FBbUU7SUFFbkUsTUFBYSx1QkFBd0IsU0FBUSxtQkFBWTtRQUN2RCxZQUNTLElBQVksRUFDWixJQUFZLEVBQ1osSUFBWSxFQUNaLE9BQWU7WUFFdEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBTFIsU0FBSSxHQUFKLElBQUksQ0FBUTtZQUNaLFNBQUksR0FBSixJQUFJLENBQVE7WUFDWixTQUFJLEdBQUosSUFBSSxDQUFRO1lBQ1osWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUd4QixDQUFDO1FBT00sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFvQjtZQUNyQyxPQUFPLElBQUksdUJBQXVCLENBQ2hDLEdBQUcsQ0FBQyxJQUFJLEVBQ1IsR0FBRyxDQUFDLElBQUksRUFDUixHQUFHLENBQUMsSUFBSSxFQUNSLEdBQUcsQ0FBQyxPQUFPLENBQ1osQ0FBQztRQUNKLENBQUM7S0FDRjtJQXZCRCwwREF1QkMifQ==
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582182478303, function(require, module, exports) {
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@ant-basement/core"], factory);
    }
})(function (require, exports) {
    
    Object.defineProperty(exports, "__esModule", { value: true });
    const core_1 = require("@ant-basement/core");
    class NetworkService extends core_1.BaseService {
        async forward(method, params) {
            const request = this.getEncoder();
            request.setBodyField({
                method,
                params,
            });
            const response = await this.transport.request(request);
            return response.body;
        }
    }
    exports.NetworkService = NetworkService;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9uZXR3b3JrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEsNkNBRzRCO0lBRTVCLE1BQWEsY0FBZSxTQUFRLGtCQUFXO1FBQ3RDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBYyxFQUFFLE1BQTBCO1lBQzdELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsQyxPQUFPLENBQUMsWUFBWSxDQUFDO2dCQUNuQixNQUFNO2dCQUNOLE1BQU07YUFDUCxDQUFDLENBQUM7WUFFSCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQztRQUN2QixDQUFDO0tBQ0Y7SUFYRCx3Q0FXQyJ9
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1582182478298);
})()
//# sourceMappingURL=index.js.map
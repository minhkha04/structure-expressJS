import { FileService } from "../services/file.service.js";
import { successResponse } from "../utils/response.util.js";

export const FileController = {
    async uploadFiles(req, res) {
        const result = await FileService.uploadFile(req);
        return successResponse(res, result, "File uploaded successfully");
    }
}
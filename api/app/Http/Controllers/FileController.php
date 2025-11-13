<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;



class FileController extends Controller
{
    // Upload de uma única foto de utilizador
    public function uploadUserPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $file = $request->file('photo');
        $path = $file->store('photos', 'public'); // Guarda em storage/app/public/photos

        return response()->json([
            'photo_url' => '/storage/' . $path, // Retorna URL acessível publicamente
        ], 200);
    }

    // Upload de múltiplos ficheiros (Card Faces)
    public function uploadCardFaces(Request $request)
    {
        $request->validate([
            'cardfaces' => 'required',
            'cardfaces.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $uploadedFiles = [];
        
        // Tratar caso de ficheiro único vs array
        $files = is_array($request->file('cardfaces')) 
            ? $request->file('cardfaces') 
            : [$request->file('cardfaces')];
        
        foreach ($files as $file) {
            $path = $file->store('cardfaces', 'public'); // Guarda em storage/app/public/cardfaces
            $uploadedFiles[] = [
                'cardface_url' => '/storage/' . $path,
            ];
        }

        return response()->json([
            'files' => $uploadedFiles,
        ], 200);
    }
}
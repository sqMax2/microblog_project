from django.shortcuts import render
from django.views.generic import TemplateView

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Post
from .serializers import *


@api_view(['GET', 'POST'])
def posts(request):
    print(request.__dict__)
    print('method: ', request.method)
    print('data: ', request.data)
    if request.method == 'GET':
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response({'data': serializer.data}, headers={'Access-Control-Allow-Origin': '*'})
    elif request.method == 'POST':
        post = Post()
        post.text = request.data['text']
        post.save()
        return Response(status=status.HTTP_200_OK, headers={'Access-Control-Allow-Origin': '*'})


@api_view(['DELETE'])
def delete_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST, headers={'Access-Control-Allow-Origin': '*'})
    post.delete()
    return Response(status=status.HTTP_200_OK, headers={'Access-Control-Allow-Origin': '*'})


@api_view(['GET'])
def like_post(request, post_id):
    if request.method == 'GET':
        try:
            post = Post.objects.get(id=post_id)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    setattr(post, 'likesCount', post.likesCount + 1)
    post.save()
    return Response(post.likesCount, status.HTTP_200_OK)


class AppView(TemplateView):
    template_name = 'default.html'

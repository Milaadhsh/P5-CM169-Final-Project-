precision highp float;


uniform vec2 u_resolution;

uniform float u_time;

uniform float Color_change;
uniform float Color_change_2;
uniform float Edge_Thick;
uniform float Smooth_Edge;
uniform float Contrast;
uniform float Num_Cells;
uniform float Repulsion_Loc;

mat2 m = mat2( 0.80,  0.60,
              -0.60,  0.80 );

float hash( float n )
{
    return fract(cos(n)*43758.5453);
}

float noise( in vec2 x )
{
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0;
    float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                    mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
    return -1.0 + 2.0*res;
}

float fbm4( vec2 p )
{
    float f = 0.0;
    f += 0.5000*noise( p ); p = m*p*2.02;
    f += 0.2500*noise( p ); p = m*p*2.03;
    f += 0.1250*noise( p ); p = m*p*2.01;
    f += 0.0625*noise( p );
    return f/0.9375;
}


void cell( in vec2 li, inout vec2 dmin, inout vec3 info, in vec2 ip, in vec2 f )
{
    float nn = (ip.x+li.x) + 57.0*(ip.y+li.y) ;
    vec2 di = li - f + vec2(hash(nn), hash(nn+1217.0));
    float d2 = dot(di,di);
    if( d2<dmin.x )
    {
        info.xy = di;
        info.z = nn;
        dmin.y = dmin.x;
        dmin.x = d2;
    }
    else if( d2<dmin.y )
    {
        dmin.y = d2;
    }
}

vec2 celular( in vec2 x, inout vec3 info )
{
    vec2 ip = floor(x);
    vec2 fp = fract(x);
    
    vec2 dmin = vec2( 2.0 );
    cell( vec2(-1.0, -1.0), dmin, info, ip, fp );
    cell( vec2( 0.0, -1.0), dmin, info, ip, fp );
    cell( vec2( 1.0, -1.0), dmin, info, ip, fp );
    cell( vec2(-1.0,  0.0), dmin, info, ip, fp );
    cell( vec2( 0.0,  0.0), dmin, info, ip, fp );
    cell( vec2( 1.0,  0.0), dmin, info, ip, fp );
    cell( vec2(-1.0,  1.0), dmin, info, ip, fp );
    cell( vec2( 0.0,  1.0), dmin, info, ip, fp );
    cell( vec2( 1.0,  1.0), dmin, info, ip, fp );
    return sqrt(dmin);
}

//------------------------------------------------------

float funcS( vec2 p )
{
    p *= 1.1 + 0.2*sin(1.0*u_time)*(1.0-0.75*length(p));
    p.x += u_time*0.04;
    p *= 0.7;
    p.x += 0.3*fbm4( 1.0*p.xy + vec2(-u_time,0.0)*0.04 );
    p.y += 0.3*fbm4( 1.0*p.yx + vec2(0.0,-u_time)*0.04 );
    vec3 info = vec3(0.0);
    vec2 c = celular( 4.0*p, info );
    float f = smoothstep( 0.0,0.5, c.y - c.x );
    f -= 0.025*fbm4(58.0*info.xy);

    return f;
}

float funcC( vec2 p, out vec4 res )
{

    p *= 1.1 + 0.2*sin(1.0*u_time)*(1.0-0.75*length(p));
    p.x += u_time*0.04;
    p *= 0.7;
    p.x += 0.3*fbm4( 1.0*p.xy + vec2(-u_time,0.0)*0.04 );
    p.y += 0.3*fbm4( 1.0*p.yx + vec2(0.0,-u_time)*0.04 );
    vec3 info = vec3(0.0);
    vec2 c = celular( 4.0*p, info );

    float f = smoothstep( 0.0,Smooth_Edge, c.y - c.x );
    res  = vec4( c.xy, info.z, fbm4( 2.0*vec2(info.xy)) );
    return f;
}

vec3 doMagic(vec2 p)
{
    // patternn    
    vec4 c = vec4(0.0);
    float f = funcC( p, c );

    // normal
    //vec2 e = vec2( 2.0/iResolution.x, 0.0 );
    vec2 e = vec2( 2.0/800.0, 0.0 );

    vec3 nor = normalize(vec3(funcS(p+e.xy) - f,
               funcS(p+e.yx) - f,
                              Edge_Thick*e.x ));
    //contrast 
    vec3 col = vec3(1.0,1.0,1.0)*Contrast;
    col *= f;
    col = mix( col, vec3(0.2,0.3,0.4), 1.0-c.x );
    col *= 1.0 + 1.0*vec3(c.w*c.w);
    col *= 1.0 + 0.2*f;

    float dif = clamp( 0.2+0.8*dot( nor, vec3(0.57703) ), 0.0, 1.0 );
  
  //change color
    vec3 lig = dif*vec3(Color_change,Color_change_2,Color_change) + nor.z*vec3(0.1,0.2,0.5) + vec3(0.5);
    col *= lig;
    col = 1.0-col;

    return col;
}

void main( )
{
    vec2 q = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = -Repulsion_Loc + Num_Cells * q;
    p.x *= u_resolution.x/u_resolution.y;
    gl_FragColor = vec4( doMagic( p ), 1.0 );
}
